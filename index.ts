// require('dotenv').config()
import dotenv from 'dotenv'
dotenv.config()
import { TwitterApi } from "twitter-api-v2"

// console.log(process.env)

const twitterClient = new TwitterApi({
	appKey: process.env.API_KEY,
	appSecret: process.env.API_KEY_SECRET,
	accessToken: process.env.ACCESS_TOKEN,
	accessSecret: process.env.ACCESS_TOKEN_SECRET,
})


// await twitterClient.v2.tweet('Hello world')

import { Configuration, OpenAIApi } from "openai"
import { start } from 'repl'

const configuration = new Configuration({
	organization: "org-cypULIVFUpfH1UqvoxLehqMj",
	apiKey: process.env.GPT_TOKEN,
})

const openai = new OpenAIApi(configuration)
// console.log(openai)
const getTweet = async () => {
	try {
		const response = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content:
						"you will make up tweets to gain lots of engagement on the techtwitter community, each tweet should be something programmers love to talk about, do not add hashtags or emojis to your outputs and don't make it too out there, also add a little sarcasm. Make it about facts and less personal. Don't mess this up",
				},
				{ role: "user", content: "next tweet" },
			],
		})
        // console.log(response.data.choices[0].message)
		return response.data.choices[0].message
	} catch (err) {
		console.log(err)
	}
}
const removeHashAndEmo = (tweet: string) => {
	const splitTweet = tweet.split(" ")
	const filtered = splitTweet.map((token, i) => {
        // console.log(filtered)
		if (token.includes("#")) return

		const notEmoji = token.split("").every((char, i) => {
			const pos = char.charCodeAt(0)
			return pos >= 0 && pos <= 222
		})
		// console.log(notEmoji)
		if (notEmoji) return token
	})
	return filtered.join(" ")
}

const sendTweet = async () => {
	const tweet = await getTweet()
	const filteredTweet = removeHashAndEmo(tweet.content)
	// console.log(filteredTweet)
    await twitterClient.v2.tweet(filteredTweet)
    console.log(`tweeted: ${filteredTweet}`)
}
console.log('started')
setInterval(sendTweet, 86400000)