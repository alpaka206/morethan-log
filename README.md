# morethan-log

<img width="1715" alt="image" src="https://user-images.githubusercontent.com/72514247/209824600-ca9c8acc-6d2d-4041-9931-43e34b8a9a5f.png">

Next.js static blog using Notion as a Content Management System (CMS). Supports both Blog format Post as well as Page format for Resume. Deployed using Vercel.

[Demo Blog](https://morethan-log.vercel.app) | [Demo Resume](https://morethan-log.vercel.app/resume)

## Features

**📒 Writing posts using notion**

- No need of commiting to Github for posting anything to your website.
- Posts made on Notion are automaticaly updated on your site.

**📄 Use as a page as resume**

- Useful for generating full page sites using Notion.
- Can be used for Resume, Portfolios etc.

**👀 SEO friendly**

- Dynamically generates OG IMAGEs (thumbnails!) for posts. ([og-image-korean](https://github.com/morethanmin/og-image-korean)).
- Dynamically creates sitemap for posts.

**🤖 Customisable and Supports various plugin through CONFIG**

- Your profile information can be updated through Config.
- Plugins support includes, Google Analytics, Search Console and also Commenting using Github Issues(Utterances) or Cusdis.

## Getting Started

1. Star this repo.
2. [Fork](https://github.com/morethanmin/morethan-log/fork) the repo to your Profile.
3. Duplicate [this Notion template](https://morethanmin.notion.site/12c38b5f459d4eb9a759f92fba6cea36?v=2e7962408e3842b2a1a801bf3546edda), and Share to Web.
4. Copy the Web Link and keep note of the Notion Page Id from the Link which will be in this format [username.notion.site/`NOTION_PAGE_ID`?v=`VERSION_ID`]. 
5. Clone your forked repo and then customize the config files based on your preference.
6. Deploy on Vercel, with the following environment variables.

   - `NOTION_PAGE_ID` (Required): The Notion page Id got from the Share to Web URL. This is not the entire URL, but just the NOTION_PAGE_ID part as shown above.
   - `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID` : For Google analytics Plugin.
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` : For Google search console Plugin.
   - `NEXT_PUBLIC_NAVER_SITE_VERIFICATION` : For Naver search advisor Plugin.
   - `NEXT_PUBLIC_UTTERANCES_REPO` : For Utterances Plugin.

## 한국어 설정 가이드

포크해서 바로 쓰는 기준으로 보면, 이제 직접 수정해야 하는 값은 대부분 `config/` 폴더에 모여 있습니다.

### 1. 설치와 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 확인합니다.

### 2. 환경변수 설정

프로젝트 루트에서 `.env.example`을 복사해 `.env.local`을 만듭니다.

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

필수 값:

- `NOTION_PAGE_ID`

선택 값:

- `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`
- `NEXT_PUBLIC_UTTERANCES_REPO`

### 3. 개인 설정 파일

#### `config/profile.js`

아래 항목을 수정합니다.

- 이름
- 프로필 이미지 경로
- 역할
- 소개글
- 이메일
- GitHub
- Instagram
- LinkedIn
- Portfolio

#### `config/site.js`

아래 항목을 수정합니다.

- 블로그 제목
- 설명
- 기본 테마
- 사이트 URL
- 시작 연도
- 언어
- OG 이미지 URL

#### `config/projects.js`

사이드 카드에 보여줄 외부 링크 목록입니다.

#### `config/seo.js`

기본 SEO 키워드입니다.

#### `config/integrations.js`

연동 기능 사용 여부를 켜고 끌 수 있습니다.

- Google Analytics
- Google Search Console
- Naver Search Advisor
- Utterances
- Cusdis

### 4. 프로필 이미지 변경

기본 이미지는 `public/gyuwon.png`입니다.

다른 이미지로 바꾸려면:

1. 원하는 파일을 `public/`에 넣습니다.
2. `config/profile.js`의 `image` 값을 바꿉니다.

예시:

```js
image: "/my-profile.png"
```

### 5. 실제로 자주 수정하는 파일

- [config/profile.js](config/profile.js)
- [config/site.js](config/site.js)
- [config/projects.js](config/projects.js)
- [config/seo.js](config/seo.js)
- [config/integrations.js](config/integrations.js)
- [.env.example](.env.example)

### 6. 참고

- 앱 내부에서는 `site.config.js`가 최종 설정을 조립합니다.
- 보통 포크 사용자라면 `site.config.js`를 직접 수정할 필요는 없습니다.
- 글 작성과 수정은 Git이 아니라 Notion에서 하면 됩니다.

## 10 Steps to build your own morethan-log (by 23.06.23)

<details>
   <summary> Click to see guide </summary>
   
   0. Prepare Notion, Vercel account.

   1. ⭐ `Star` and `Fork` this repo.
   <img src='https://github.com/jhk0530/morethan-log/assets/6457691/b0421776-2bfe-42bc-ae31-d90206fd5789' width = '500'>
   <img src='https://github.com/jhk0530/morethan-log/assets/6457691/185a8e4c-4ae2-4a38-b6f4-dc2a06a45c28' width = '500'>

   2. As you `click` the [Notion template](https://quasar-season-ed5.notion.site/12c38b5f459d4eb9a759f92fba6cea36?v=2e7962408e3842b2a1a801bf3546edda), you will see this notion page in your browser. Click `Duplicate` button(복제 in image) in right top.
   <img src='https://github.com/jhk0530/morethan-log/assets/6457691/a5375429-28f0-4bba-a355-0d391cad58db' width = '500'>

   3. And you will see `notion page in notion app` in your account.
   <img src='https://github.com/jhk0530/morethan-log/assets/6457691/09af5533-43d9-48e5-95eb-dcac84c97c1f' width = '500'>

   4. Click `Share` and `Publish` in right top, and check web link. (Copy web link)
   <img src='https://github.com/jhk0530/morethan-log/assets/6457691/886fe4a2-79ca-4dbc-b1e1-93984e7e3f44' width = '500'>
   
   5. `Modify` config files in **your** forked repo.
   > 💡 NOTE. Update your profile and site values in the `config/` folder.

   6. Move and `login` to vercel.
   <img src='https://github.com/jhk0530/morethan-log/assets/6457691/07742ad0-4766-43b0-9ebd-5311f9711bc2' width = '500'>

   7. `Build` new project using **Add New...**
   <img src='https://github.com/jhk0530/morethan-log/assets/6457691/517d46be-c9bf-4181-aaa5-e9bd2fcdc822' width = '500'>

   8. `Import` **your forked morethan-log repository**
   <img src='https://github.com/jhk0530/morethan-log/assets/6457691/07742ad0-4766-43b0-9ebd-5311f9711bc2' width = '500'>

   9. `Add` **Environment variabes** to vercel project
   <img src='https://github.com/jhk0530/morethan-log/assets/6457691/703b50a3-3a90-4915-ab73-1baca4c285f8' width = '500'>

   10. `Wait` for the deployment to complete. After the deployment is successful, you should see an image like the one below.
   <img src='https://github.com/jhk0530/morethan-log/assets/6457691/a7d72caa-4354-4f81-9577-c773faeed7c6' width = '500'>

   🥳 Congratulations. Now check out your blog
   
   <img src='https://github.com/jhk0530/morethan-log/assets/6457691/3876a273-a270-47ef-a2ad-663519d9e537' width = '500'>

</details>

## FAQ

<details>
   <summary> Click to see FAQ </summary>
   Q1: If you finish making avatar.svg, How to make favicon.ico and apple-touch-icon.png?
   
   A1: check out https://www.favicon-generator.org/
   
   Q2: Is it necessary to set up a sitemap file?   
   A2: The system will dynamically create a sitemap.xml, so there is no need for manual setup.

   Q3: Why don’t Notion posts update automatically?   
   A3: Please set the revalidateTime in site.config.js and observe how long it takes to update.
   
   Q4: What should be entered for NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID and NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in site.config.js?
   A4: You can check https://github.com/morethanmin/morethan-log/issues/203. Please note that updates may take some time to take effect after setting.

If you encounter any other issues, please feel free to add them to the GitHub README to assist future users. We look forward to your contributions!

</details>

## Contributing

Check out the [Contributing Guide](.github/CONTRIBUTING.md).

### Contributors

<!--
Contributors template:
<a href="https://github.com/{username}"><img src="{src}" width="50px" alt="{username}" /></a>&nbsp;&nbsp;
-->

<a href="https://github.com/morethanmin/morethan-log/graphs/contributors">
<img src="https://contrib.rocks/image?repo=morethanmin/morethan-log" />
</a>

## Support

morethan-log is an MIT-licensed open source project. It can grow thanks to the sponsors and support from the amazing backers.

### Sponsors

<!--
Sponsors template:
<a href="https://github.com/{uesrname}"><img src="{src}" width="50px" alt="{username}" /></a>&nbsp;&nbsp;
-->

<p>
<a href="https://github.com/siyeons"><img src="https://avatars.githubusercontent.com/u/35549653?v=4" width="50px" alt="siyeons" /></a>&nbsp;&nbsp;
</p>

## License

The [MIT License](LICENSE).
