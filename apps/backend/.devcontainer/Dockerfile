# Node 20 dev image ships with git, curl, sudo and a `node` user.
FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Only extra packages needed: the egress firewall toolchain (iptables/ipset)
# plus dig for resolving the allowlist.
RUN apt-get update \
  && apt-get install -y --no-install-recommends iptables ipset dnsutils \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install the Claude Code CLI from Anthropic's signed apt repository. 
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

# Local PostgreSQL for development inside the sandbox. 
RUN apt-get update \
  && apt-get install -y --no-install-recommends postgresql-17 postgresql-17-pgvector \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Drop the base image's blanket passwordless root for `node`. 
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
