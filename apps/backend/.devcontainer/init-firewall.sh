#!/bin/bash
# Minimal egress allowlist for the dev container.
#
# Default policy is DROP. Only DNS, loopback, the Docker host network, and the
# handful of domains Claude Code + this project need are allowed out.
# This script re-runs on every container start.
set -euo pipefail
IFS=$'\n\t'

# --- Preserve Docker's internal DNS NAT rules across the flush ---
DOCKER_DNS_RULES=$(iptables-save -t nat | grep "127\.0\.0\.11" || true)

iptables -F && iptables -X
iptables -t nat -F && iptables -t nat -X
iptables -t mangle -F && iptables -t mangle -X
ipset destroy allowed-domains 2>/dev/null || true

if [ -n "$DOCKER_DNS_RULES" ]; then
    iptables -t nat -N DOCKER_OUTPUT 2>/dev/null || true
    iptables -t nat -N DOCKER_POSTROUTING 2>/dev/null || true
    echo "$DOCKER_DNS_RULES" | xargs -L 1 iptables -t nat
fi

# --- Baseline: DNS + loopback must work before we resolve the allowlist ---
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A INPUT  -p udp --sport 53 -j ACCEPT
iptables -A INPUT  -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

ipset create allowed-domains hash:net

# Resolve each allowed domain to its current IPs and add them to the ipset.
add_domain() {
    local domain="$1"
    echo "Resolving $domain..."
    local ips
    ips=$(dig +short A "$domain")
    if [ -z "$ips" ]; then
        echo "ERROR: failed to resolve $domain"
        exit 1
    fi
    while read -r ip; do
        [[ "$ip" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]] || continue
        ipset add allowed-domains "$ip" 2>/dev/null || true
    done < <(echo "$ips")
}

# --- Core: what Claude Code itself needs (sign-in + inference) ---
for domain in \
    "api.anthropic.com" \
    "console.anthropic.com" \
    "claude.ai"; do
    add_domain "$domain"
done

# --- GitHub: general HTTPS access (clone public repos, gh API, raw files).
# These IPs are only reachable over port 443 (see the port-22 REJECT below),
# so this does NOT enable SSH-key push/pull. ---
for domain in \
    "github.com" \
    "api.github.com" \
    "codeload.github.com" \
    "objects.githubusercontent.com" \
    "raw.githubusercontent.com"; do
    add_domain "$domain"
done

# --- ADD-BACK MENU: uncomment what this project actually needs ---
for domain in \
    "registry.npmjs.org" \
    "unpkg.com" \
    "cdnjs.cloudflare.com" \
    "opentopo.bahnzumberg.at" \
    "uat-dump.zuugle.at"; do
    add_domain "$domain"
done
# Still commented out — uncomment if you need them in-container:
# for domain in \
#     "marketplace.visualstudio.com" \  # install VS Code extensions in-container
#     "vscode.blob.core.windows.net" \  #   "
#     "update.code.visualstudio.com" \  #   "
#     "sentry.io"; do                   # Claude Code error reporting
#     add_domain "$domain"
# done
#
# Puppeteer downloads Chromium from a Google CDN during `npm install`. Rather
# than allowlisting that, prefer either: install Chromium via apt in the
# Dockerfile and set PUPPETEER_SKIP_DOWNLOAD=1, or run `npm install` once
# before the firewall is active.

# --- Allow the Docker host network (e.g. local Postgres on :5433) ---
HOST_IP=$(ip route | awk '/default/ {print $3; exit}')
if [ -n "${HOST_IP:-}" ]; then
    HOST_NETWORK=$(echo "$HOST_IP" | sed 's/\.[0-9]*$/.0\/24/')
    echo "Allowing host network: $HOST_NETWORK"
    iptables -A INPUT  -s "$HOST_NETWORK" -j ACCEPT
    iptables -A OUTPUT -d "$HOST_NETWORK" -j ACCEPT
fi

# --- Default deny, then allow established + the allowlist ---
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT DROP
iptables -A INPUT  -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
# Block ALL new outbound SSH before the allowlist: this is what makes the host
# SSH key unusable for git push/pull (git@github.com), even if the editor
# forwards the agent. Nothing in this container needs outbound SSH.
iptables -A OUTPUT -p tcp --dport 22 -j REJECT --reject-with tcp-reset
iptables -A OUTPUT -m set --match-set allowed-domains dst -j ACCEPT
iptables -A OUTPUT -j REJECT --reject-with icmp-admin-prohibited

# --- Sanity checks ---
# GitHub over HTTPS must work (general access is intentionally allowed).
if ! curl --connect-timeout 5 -s https://github.com >/dev/null 2>&1; then
    echo "ERROR: github.com should be reachable over HTTPS but is not"
    exit 1
fi
# Outbound SSH must be blocked, so the host SSH key can't push/pull.
if timeout 5 bash -c '</dev/null exec 3<>/dev/tcp/github.com/22' 2>/dev/null; then
    echo "ERROR: outbound SSH (port 22) is open but should be blocked"
    exit 1
fi
echo "Firewall active: default-deny egress, GitHub HTTPS allowed, SSH blocked, allowlist applied."
