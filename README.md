# GLITCH — playable multiplayer prototype

A zero-dependency Node.js multiplayer party game with Server-Sent Events for live updates and HTTP POST for actions.

## Run

Requires Node.js 18+.

```bash
npm start
```

Open `http://localhost:3000` on your computer. To play on phones on the same Wi-Fi network, use `http://YOUR_COMPUTER_LAN_IP:3000` (allow the port through your firewall). For remote friends, deploy this folder to a Node.js hosting provider that supports persistent processes and SSE; configure the service start command as `npm start` and share its HTTPS URL. Hosting is **not** automatically provisioned.

## Prototype features

- Create/join 4-letter room; host chooses 5, 7 or 10 rounds
- 75-second round: 5s ready, 25s challenge, 8s reveal, 15s vote, 22s mutation; shortened challenge mutation makes a 67-second round
- Four challenges: tap timing, crowd guessing, ordering, majority prediction
- Private Glitch role, corrupted challenge targets, Suspicion Meter clue, voting, scoring, mutation cards
- Reconnect via browser localStorage session; live room updates via SSE
- Host handoff on timeout, spectators after start, auto cleanup of idle rooms
- Responsive neon interface, simple sound and vibration, three-screen tutorial

## Known limitations of this prototype

- State is **in memory**. Restarting the server loses active games. Use Redis or a database for production.
- This uses SSE instead of WebSockets, adequate for small groups but not designed for large scale.
- Reconnection depends on localStorage; private browsing or cleared storage loses player identity.
- No bot players; testing requires two browsers/devices.
- No auth or anti-spam rate limits. Do not expose publicly at scale without hardening.
- In two-player mode, one player is always the Glitch, and the detective's yes/no question is consequently too predictable; improve by introducing no-Glitch rounds before a competitive launch.
- Challenge prompts repeat after seven rounds. Add a larger curated prompt library before contest submission.
- Mutation selection timeout skips choosing a card if no choice is made.
