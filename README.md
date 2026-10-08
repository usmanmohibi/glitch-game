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

## Solo demo mode
On the home screen, enter an optional name and select **TRY IT SOLO**. A private room starts immediately with Byte, Pixel, and Static. It has three scored rounds plus an unscored practice round. The practice round has a bot Glitch and a human Detective; the first scored round makes the human the Glitch, and the second makes the human the Detective. Bots answer, vote, and choose mutations automatically. Regular multiplayer is unchanged.

The question deck includes at least 10 additional prompts for each of the four challenge types. Prompts are drawn without replacement per room, including the practice round.


## Question variety update

- The browser remembers the last 30 question IDs in `localStorage` (`glitch-recent-questions`).
- New solo games and multiplayer hosts send this list to the server. The server favors unseen questions, does not repeat a question within a game while alternatives remain, and never chooses the same challenge type twice consecutively.
- The question bank has 24 Crowd Guess, 24 Speed Sort, 24 Majority Mind and 13 Tap Sync challenges, each with a distinct title.
- Tap Sync uses slow (1200 ms), medium (900 ms), fast (650 ms), and accelerating beats (1200 ms then 650 ms after 10 seconds). The same timing error scoring and Glitch off-beat order apply.

## Topic selection and question bank

The host selects a topic in the lobby before starting. Solo players select a topic in their bot-filled lobby and then start the three-round game. All room members see the selected topic, and the topic label remains visible in-game.

Topics: History, Science & Space, Geography, Sports, Movies/Music/Pop Culture, Food & Drink, Animals & Nature, and Random Mix. `topic_questions.json` contains 154 new topic-specific questions (22 per topic: 8 Crowd Guess, 8 Speed Sort, and 6 Majority Mind). Tap Sync remains topic-neutral with slow, medium, fast, and accelerating rhythms.

The browser remembers the last 30 question IDs; the host's history is used to prefer unseen prompts. The server prevents adjacent rounds from sharing a challenge type. Existing multiplayer, bot, Detective, reconnect, scoring, mutation, practice, and award mechanics are retained.

## Original procedural background music (new)

`public/music.js` generates eight original looping instrumentals in the browser using Web Audio oscillators and synthesized percussion; there are no music downloads, audio files, or copyrighted samples. Each selected topic has its own tempo, melody, synthesized instruments, and rhythm. The soundtrack follows the lobby topic selection and continues through gameplay at low volume, becoming more intense during voting. It fades out for Tap Sync, fades back afterward, plays a reveal sting, and stops at Game Over for a short victory jingle.

The separate 🎵 MUSIC ON/OFF control does not affect the existing 🔊 SOUND toggle. Music choice is saved as `glitch-music-choice` in browser localStorage. Without a stored preference, the host and solo player start with music enabled and multiplayer guests start muted. Audio starts only after user interaction, and unsupported/blocked audio fails silently. If a browser has previously saved a music preference, that explicit choice takes priority over role defaults.
