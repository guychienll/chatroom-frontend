import { Card, CardHeader, Chip, Image } from "@nextui-org/react";

const LEARNINGS = [
    "Node.js",
    "express-session",
    "class-validator",
    "Gmail SMTP",
    "WebSocket",
    "Firebase Firestore",
    "TypeScript",
    "Next.js",
    "NextUI",
    "React",
    "TailwindCSS",
    "Yup",
    "AWS S3",
    "Fly.io",
    "Docker",
    "Docker Compose",
];

function About() {
    return (
        <div className="min-h-[calc(100dvh-4rem)] bg-[#F7F6F2] px-4 py-6">
            <div className="content ml-auto mr-auto max-w-[1296px]">
                <div className="section flex flex-col pt-12 md:flex-row">
                    <div className="my-1 flex-1 px-2 md:px-8">
                        <div className="title mb-4 text-5xl font-bold tracking-wider text-danger">
                            關於 ChatRoom
                        </div>
                        <p className=" text-large leading-8 ">
                            ChatRoom
                            是一個匿名聊天室，你可以在這裡和陌生人聊天，透過隨機配對的方式，讓你有機會認識不同的人。
                            你可以選擇是否匿名，保護你的隱私，並且保留聊天記錄，讓你可以找回心儀的對象。
                        </p>
                    </div>
                    <div className="flex-1 px-2 md:px-8">
                        <Image width={500} src="/README/chat.gif" alt="" />
                    </div>
                </div>
                <div className="section flex flex-col justify-evenly pt-12 md:flex-row-reverse">
                    <div className="my-1 flex-1 px-2 md:px-8">
                        <div className="title mb-4 flex-1 text-5xl font-bold tracking-wider text-danger">
                            開發者
                        </div>
                        <p className="text-large leading-8 ">
                            透過 ChatRoom 開發，學習並且熟練如何使用以下技術
                            <div className="flex flex-wrap">
                                {LEARNINGS.map((learning) => (
                                    <Chip
                                        color="danger"
                                        variant="dot"
                                        className="mb-1 ml-1"
                                        key={learning}
                                    >
                                        {learning}
                                    </Chip>
                                ))}
                            </div>
                            並且透過這個專案，學習如何開發一個完整的應用程式。
                        </p>
                    </div>
                    <div className="flex flex-1 justify-center px-2 md:px-8">
                        <Card className="max-w-[300px]">
                            <CardHeader className="absolute top-1 z-10 flex-col !items-start">
                                <p className="text-tiny font-bold uppercase text-white/60">
                                    guychienll@gmail.com
                                </p>
                                <h4 className="text-large font-medium text-white">
                                    Guy Chien
                                </h4>
                            </CardHeader>
                            <Image
                                alt="guy image"
                                className="object-fit z-0"
                                src="/README/guy.jpg"
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
