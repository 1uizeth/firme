##   🛡️ Anti-Hack Toolkit

Protect your digital identity. Preserve immutable proof of attack.

A decentralized, privacy-first protocol that empowers users whose accounts have been hacked or impersonated. Built on Oasis Sapphire and ROFL, Anti-Hack Toolkit provides censorship-resistant infrastructure to detect, report, and preserve proof of malicious activity—while keeping both reporters and victims completely anonymous.

⸻

## ✊ Why Anti-Hack Toolkit?

In today’s digital world, account takeovers, impersonation scams, and malicious messages can leave victims without recourse or evidence. Traditional approaches—screenshots, chat logs, centralized takedown requests—are:
	•	Mutable or tampered: Screenshots can be edited, logs can be deleted.
	•	Privacy-compromising: Reporting often exposes personal data of both victim and reporter.
	•	Slow or fragmented: Cross-platform reporting requires multiple channels and does not guarantee permanent proof.

Blockchain is essential: only on-chain records are tamper-proof, decentralized, and permanent. Anti-Hack Toolkit leverages Oasis’s confidential EVM (Sapphire) and secure TEE (ROFL) to give hacked users and bystanders a clear, privacy-preserving way to detect wrongdoing, preserve evidence, and coordinate recovery—without exposing identities.

⸻

## 🔍 What It Does

## 1️⃣ Malicious Message Detection (Telegram Client)
	•	Privacy-preserving phishing/reporting:
Users forward suspicious Telegram messages into a confidential monitoring bot.
ROFL verifies that the report comes from a trusted, anonymized origin, and Sapphire stores an encrypted record of the malicious content.
	•	Fast alerts: The bot automatically scans for known phishing patterns or impersonation attempts and warns users in real time—without ever revealing who reported the message.

## 2️⃣ Cross-Platform Impersonation Flags (Web App)
	•	Creator-verification lookup:
Anyone can search for a “favorite creator” (social handle, username, etc.) to see if a hijacked or impersonated account has been flagged on Telegram, Twitter, Instagram, or other platforms.
	•	Flag suspicious content:
Users click “Raise Flag” next to a detected impersonator. That action triggers a confidential on-chain transaction (via Sapphire) that permanently anchors proof of impersonation.
	•	Delegated reputation management:
Verified creators (or organizations) can register a “recovery delegate” (trusted lawyer, community moderator, or friend) to handle all flags over time—preventing attackers from degrading their online reputation.

⸻

## 🔑 Feature Examples

## 1️⃣ Telegram-Based Malicious Message Reporting

“I received a private message claiming to be from @TrustedSupportBot asking for my seed phrase. I forwarded that chat to the Anti-Hack Telegram bot. Within seconds, the bot responded: ‘This message matches a known phishing pattern. Be careful!’ Best of all, no one ever knew which user reported it—my privacy was preserved.”

	•	Encrypted, confidential record: The original malicious payload is stored under an encrypted pointer on Sapphire.
	•	Real-time detection: ROFL’s off-chain logic evaluates message hashes against a curated threat database without leaking content.
	•	Immutable proof: Even if the malicious account is later deleted, the on-chain record remains.

⸻

## ⚙️ How It Works

## 🔧 Tech Overview
	•	Oasis Sapphire – Confidential EVM that encrypts smart contract state and keeps on-chain records private.
	•	Oasis ROFL – A secure TEE environment for off-chain logic (e.g., malicious message scanning, impersonation pattern matching).
	•	Civic + Wagmi Frontend –
	•	CivicAuth handles walletless, wallet-bound login, so end users never manage private keys directly.
	•	Wagmi + RainbowKit provides a seamless “Connect Wallet” experience.
	•	Telegram Bot Integration – A TEE-signed bot endpoint that receives forwarded messages, runs ROFL checks, then logs a confidential entry on Sapphire.
	•	Web App – Users connect via Civic + Wagmi to a Sapphire contract that tracks impersonation flags. Creators can register delegates to manage flags.

⸻
