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

# Local PostgreSQL for development inside the sandbox. Installed at BUILD time
# (image build has full network, before the runtime egress firewall applies) so
# the runtime allowlist stays tiny. postgresql-17 ships the contrib extensions
# (cube, earthdistance, pg_trgm) and postgresql-17-pgvector adds `vector` —
# matching the pgvector/pgvector image used in UAT/PROD. Postgres runs on
# 127.0.0.1 (loopback is always firewall-allowed); see start-postgres.sh.
RUN apt-get update \
  && apt-get install -y --no-install-recommends postgresql-17 postgresql-17-pgvector \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Drop the base image's blanket passwordless root for `node`. The
# mcr.microsoft.com/devcontainers/javascript-node image ships /etc/sudoers.d/node
# with `node ALL=(root) NOPASSWD:ALL`, which would let the container user (and any
# code/agent running as it) rewrite the egress firewall, run apt, flush iptables,
# etc. Remove it so `node` can sudo ONLY the two audited scripts below — and only
# with no arguments (the trailing "" pins argv). The scripts are root-owned and
# not writable by `node`, so they cannot be edited and then sudo-run.
RUN rm -f /etc/sudoers.d/node

# Install the Postgres start script and allow `node` to run ONLY it as root.
COPY start-postgres.sh /usr/local/bin/start-postgres.sh
RUN chown root:root /usr/local/bin/start-postgres.sh \
  && chmod 0755 /usr/local/bin/start-postgres.sh \
  && echo 'node ALL=(root) NOPASSWD: /usr/local/bin/start-postgres.sh ""' > /etc/sudoers.d/node-postgres \
  && chmod 0440 /etc/sudoers.d/node-postgres

# Ensure the Claude config dir exists and is owned by `node`; a named volume
# mounted here inherits this ownership on first use.
RUN mkdir -p /home/node/.claude && chown -R node:node /home/node/.claude

# Install the firewall script and allow `node` to run ONLY that script as root
# (no arguments — the trailing "" pins argv). Root-owned and not node-writable.
COPY init-firewall.sh /usr/local/bin/init-firewall.sh
RUN chown root:root /usr/local/bin/init-firewall.sh \
  && chmod 0755 /usr/local/bin/init-firewall.sh \
  && echo 'node ALL=(root) NOPASSWD: /usr/local/bin/init-firewall.sh ""' > /etc/sudoers.d/node-firewall \
  && chmod 0440 /etc/sudoers.d/node-firewall
