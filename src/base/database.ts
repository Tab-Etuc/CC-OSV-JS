import { MongoDB } from "@base/CC-OSV-Client.ts";

export async function checkGuildData(guildId: BigInt, authorId: BigInt) {
  const db = MongoDB.database("Beta"),
    Guilds = db.collection("Guilds"),
    Users = db.collection("Users"),
    GuildData = await Guilds.findOne({
      _id: guildId?.toString(),
    }),
    UserData = await Users.findOne({
      _id: authorId.toString(),
    });

  GuildData || await Guilds.insertOne({
    _id: guildId?.toString(),
    ButtonRole: [],
    ChannelClockTime: [],
    ChannelClockDate: [],
    levelPrizes: [],
    CommandRan: 0,
    SongsPlayed: 0,
  });
  UserData || await Users.insertOne({
    _id: authorId.toString(),
    GuildId: guildId?.toString(),
    Xp: 0,
    Level: 1,
    CoinsInWallet: 500,
    CoinsInBank: 20000,
    bankSpace: 200000,
    items: [],
    interest: 1,
  });
}
