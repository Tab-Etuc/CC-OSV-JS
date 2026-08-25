export interface SongInfo {
  track: string; // Lavalink 播放用的編碼
  title: string; // 歌曲標題
  link: string; // 歌曲網址
  queued: bigint; // 加入佇列的使用者 ID
}
