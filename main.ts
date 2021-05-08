import {PuppetPadlocal} from "wechaty-puppet-padlocal";
import {Contact, log, Message, ScanStatus, Wechaty} from "wechaty";
import * as assert from "assert";

const puppet = new PuppetPadlocal({
    token: "puppet_padlocal_f8f0637ce95f40fdb0bfdba0ac7cbbe7"
})

const bot = new Wechaty({
    name: "TestBot",
    puppet,
})

    .on("scan", (qrcode: string, status: ScanStatus) => {
        if (status === ScanStatus.Waiting && qrcode) {
            const qrcodeImageUrl = [
                'https://wechaty.js.org/qrcode/',
                encodeURIComponent(qrcode),
            ].join('')

            log.info("TestBot", `onScan: ${ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`);

            require('qrcode-terminal').generate(qrcode, {small: true})  // show qrcode on console
        } else {
            log.info("TestBot", `onScan: ${ScanStatus[status]}(${status})`);
        }
    })

    .on("login", (user: Contact) => {
        log.info("TestBot", `${user} login`);
    })

    .on("logout", (user: Contact, reason: string) => {
        log.info("TestBot", `${user} logout, reason: ${reason}`);
    })

    // .on("message", async (message: Message) => {
    //     log.info("TestBot", `on message: ${message.toString()}`);
    // })

    .on("error", (error) => {
        log.error("TestBot", 'on error: ', error.stack);
    })


async function onMessage(message: Message): Promise<void> {
    if (await message.mentionSelf()) {
        const room = message.room()
        if (!room) {
            throw new Error('Should never reach here: a mention message must in a room')
        }

        console.info(message.text())
        // "@bot Hello"
        // console.info(await message.mentionList())
        // [bot]
        // console.info(await message.mentionText())
        // "Hello"

        var uname: string = message.text();
        var reply = uname.replace("吗", ' ').replace(
            "?", " ").replace("我", " ").replace("你", "我").replace("我不", " ").replace("？", "").replace(
            "@璇珠官人", "").replace("是不是", "不是").replace("哦", " ~o(〃'▽'〃)o").replace("@璇珠官人", "");
        console.info("my reply: \n\t")
        console.info(reply)
        // const talker = room.talker()
        // await room.say`Thanks for mention me!`
        await room.say`${reply}`
    }
}

bot.on('message', onMessage)


bot.start().then(() => {
    log.info("TestBot", "started.");
});

