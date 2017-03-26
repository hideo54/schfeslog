# schfeslog

スマートフォンゲーム「ラブライブ! スクールアイドルフェスティバル」のプレイログを取得して色々するためのHTTPプロキシです。

**今年3月から運営のサーバーとの通信の全てにTLSが使用されるようになったため、現在のコードは一切動作しません。間もなくアップデートする予定ですのでもう少しお待ち下さい。**

**Current code does NOT work at all because the game has started to use TLS for all communications with official servers since March. I am planning to provide updates as soon as possible.**

## バージョン

v1.2.8 (2017/3/5)

## 機能

* 通常ライブの結果の読み取り、およびそれの
    * txtファイルへのログ出力
    * Twitterへの投稿
    * 任意のサーバーへのデータ送信

## 注意点

1. 曲情報はそのIDでしか推測できないため、そのIDに該当する曲の曲名をdata.jsonで管理しています。まだ登録されていない場合は、そのままのIDが出力されます。もしdata.jsonをそれなりに埋めてくださったなら、Pull Requestを出してくれると喜びます。

2. スクフェス利用以外の通信も全て通るようにしてありますので、非推奨ですが、常時接続でも(エラーが出て停止しなければ)問題ない作りになっています。

3. 何の認証も用意していませんので、プロキシサーバーと同一ネットワークにいる他の人がこのプロキシサーバーに接続してスクフェスをプレイした時も、同様にツイートされます。自分しか利用しないことが確実なネットワーク上で走らせ、その外で利用したい場合は適宜VPNを挟むなどしてください。

## 使い方

### 初期設定

1. `npm install`
2. `cp settings-sample.json settings.json`
3. settings.json内のTwitterの項目を適する形で上書きします。

### プレイ時

1. `node main.js`
2. nodeを走らせているサーバーのアドレスとポート番号をスクフェス端末のOSのプロキシ設定に指定。
3. スクフェスをプレイ!

## 追加予定機能

[Projects](https://github.com/hideo54/schfeslog/projects/1)をご覧ください。

## 連絡先

* E-mail: contact@hideo54.com
* Twitter: @hideo54
