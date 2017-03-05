# schfeslog

スマートフォンゲーム「ラブライブ! スクールアイドルフェスティバル」のプレイログを取得して色々するためのHTTPプロキシです。

(**自己責任で使用してください。**)

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
