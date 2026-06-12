# kouun-site

会社公式サイト（静的HTML）。

## 構成

```
kouun-site/
├── index.html      # トップページ
├── css/
│   └── style.css
├── images/         # 画像置き場
└── README.md
```

## ローカル確認（重要）

**Cursor 右側のプレビューでは正しく表示されません。**

### いちばん簡単な方法

1. エクスプローラーで `D:\project\kouun-site` を開く
2. **`preview.bat`** をダブルクリック
3. Chrome / Edge が開き、`http://localhost:5500` でサイトが表示されます

`preview.bat` が動かない場合は **`open-index.bat`** をダブルクリックしてください。

### オンラインで見る（GitHub Pages）

https://setroundly.github.io/kouun-site/

※ ローカルで編集した内容は、GitHub に push するまでオンライン版には反映されません。

## FTPアップロード

このフォルダの中身を、サーバーの公開ディレクトリ（`public_html` など）にそのままアップロードしてください。

- `index.html` がドキュメントルート直下にあること
- `css/` フォルダも一緒にアップロードすること

## 会社PCへの移行

`kouun-site` フォルダごとコピーすれば、そのまま編集・FTPアップロードが可能です。
