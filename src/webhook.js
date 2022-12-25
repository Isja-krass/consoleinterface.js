/**
 * ===[ INFO ]==================================================================
 * @file ./src/webhook.js
 * @brief Request handler for Discord webhooks
 * @created 20-08-2022@16:59:33.015
 * @author isja_krass
 * @version 0.0.1
 * 
 * IMPORTANT NOTE:
 * This part of the code comunicates with the [Discord API](https://https://discord.com/developers/docs).
 * Discord is a free text and voice chat service, providing an easy way to send messages directly into text-chanels via a vieiw
 * JSON requests. Please note that the informations you may send over the code below are leaving your device and get transmittet to
 * the Discord API-Server. Nigther the developers, contribotrs or publishers ar affiliated with the company "Discord".
 * 
 * Due to some text-channels are publicly visible:
 * **! PERSONAL, OR ANY OTHER KIND OF SENSITIVE INFORMATION MAY BE LEAKED TO PUBLIC OR THIRD PARTIES !**
 * 
 * =============================================================================
 */

// INCLUDE libs
const HTTPS = require("https");

/// EXPORT MASTERCLASS ///
module.exports = class {

    /**
     * Creates a new webhook instance. See [Discord Webhook docs](https://discord.com/developers/docs/resources/webhook) for more information
     * @param {string} webhookURL webhook URL provided to you from the plattform 
     */
    constructor (webhookURl) {
        this.id = webhookURl.replace("https://discord.com/api/webhooks/", "").split("/")[0];
        this.token = webhookURl.replace("https://discord.com/api/webhooks/", "").split("/")[1];
    };

    /**
     * Gets inforamtion about the webhook client.
     * @return {Promise} Returns the [webhook object](https://discord.com/developers/docs/resources/webhook#webhook-object-example-incoming-webhook)
     */
    get () {
        return new Promise((resolve, reject) => {
            var chunkData = "";
            this.request = HTTPS.request({
                host: "discord.com",
                path: `/api/webhooks/${this.id}/${this.token}`,
                method: "GET",
                headers: {
                    "Accept": "application/json",
                }
            }, (res) => {
                res.on("data", (chunk) => {
                    chunkData = chunk
                });
                res.on("error", (err) => {
                    reject(err);
                });
                res.on("end", () => {
                    if (res.statusCode == 200) {
                        resolve(chunkData.toString());
                    } else {
                        reject();
                    };
                });
            });
            this.request.end();
        });
    };

    /**
     * Execute Webhook, write Data to message
     * @param {object} data Date written to message
     * @param {string} data.content the message contents (up to 2000 characters)
     * @param {string} data.username override the default username of the webhook
     * @param {URL} data.avatar_url override the default avatar of the webhook
     * @param {boolean} data.tts true if this is a TTS message
     * @param {object} data.components[] array of message components
     * @param {objects} data.embeds[] embedded rich content
     */
    execute (data) {
        this.request = HTTPS.request({
            host: "discord.com",
            path: `/api/webhooks/${this.id}/${this.token}`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        }, (res) => {
            res.on("error", (err) => {
                
            });
            res.on("end", () => {
    
            });
        });
        this.request.write(JSON.stringify(data));
        this.request.end();
    };

};