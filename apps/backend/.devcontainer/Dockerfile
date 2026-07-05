# Node 20 dev image ships with git, curl, sudo and a non-root `node` user.
FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Only extra packages needed: the egress firewall toolchain (iptables/ipset)
# plus dig for resolving the allowlist. Everything else is add-back-when-needed.
RUN apt-get update \
  && apt-get install -y --no-install-recommends iptables ipset dnsutils \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install the Claude Code CLI from Anthropic's signed apt repository. This
# replaces the anthropics/claude-code devcontainer feature: the base image
# already ships Node, and the apt package (unlike the native curl installer)
# does NOT auto-update, which matches DISABLE_AUTOUPDATER and the locked-down
# egress allowlist — no runtime calls to claude.ai to fetch updates. Swap the
# `stable` suite for `latest` if you want new releases as soon as they ship.
# Verify the key fingerprint out of band: gpg --show-keys should report
# 31DD DE24 DDFA B679 F42D 7BD2 BAA9 29FF 1A7E CACE.
RUN install -d -m 0755 /etc/apt/keyrings \
  && curl -fsSL https://downloads.claude.ai/keys/claude-code.asc \
       -o /etc/apt/keyrings/claude-code.asc \
  && echo "deb [signed-by=/etc/apt/keyrings/claude-code.asc] https://downloads.claude.ai/claude-code/apt/stable stable main" \
       > /etc/apt/sources.list.d/claude-code.list \
  && apt-get update \
  && apt-get install -y --no-install-recommends claude-code \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Ensure the Claude config dir exists and is owned by `node`; a named volume
# mounted here inherits this ownership on first use.
RUN mkdir -p /home/node/.claude && chown -R node:node /home/node/.claude

# Install the firewall script and allow `node` to run ONLY that script as root.
COPY init-firewall.sh /usr/local/bin/init-firewall.sh
RUN chmod +x /usr/local/bin/init-firewall.sh \
  && echo "node ALL=(root) NOPASSWD: /usr/local/bin/init-firewall.sh" > /etc/sudoers.d/node-firewall \
  && chmod 0440 /etc/sudoers.d/node-firewall
