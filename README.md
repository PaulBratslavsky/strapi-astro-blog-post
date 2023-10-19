## What is Astro ?

Astro is another JavaScript-based static site generator, but ships ZERO JavaScript to the client by default. Astro provides a frictionless developer experience to get started as it allows you to bring your framework to build sites and has Astro components.

Thats right!

You can use React, Angular, Svelte, or Vue or together at any point in the project to build a super-fast and SEO-friendly website.

What's unique about Astro compared to other static site generators is its first-class support for loading JavaScript on-demand.

The concept is called [Progressive Enhancement/Partial Hydration](https://docs.astro.build/core-concepts/component-hydration/). Unlike other correctly frameworks like Next.js or Gatsby, Astro assumes your site will always be static and gives the flexibility to load JavaScript if and when needed only.

In addition to all that, Astro has out of the box support for

- Stying with CSS Modules, Sass and Tailwind,
- TypeScript
- Markdown
- MDX files
- RSS feeds
- pagination.

It comes with everything needed to build a site without adding or configuring libraries that support the above, a great starter into the world of JAM Stack.

Assuming that introduction got you interested in Astro, let move ahead and build something with it.

## **What to expect from this tutorial?**

In this tutorial, we will be learning to build a blogging application using Strapi as the CMS and Astro powered by React to build the frontend.

Why a blog application? When playing around with a new technology building, a decoupled blog application encompasses all the concepts you will need to know to build any web application from database concepts, web APIs, and frontend design and development.

While this tutorial is beginner-friendly, you'll need to have/do the following before you can follow along

- Basic understanding of React. The React team recently released a [comprehensive documentation](https://beta.reactjs.org/)
- Basic understanding of [Strapi](https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html).
- Familiarity with [Tailwind CSS classes](https://tailwindcss.com/docs).
- Skim through the syntax of [Astro](https://docs.astro.build/core-concepts/astro-components/)
- Have one of these Node.js versions installed - v12.20.0, v14.13.1, v16.0.0, or higher.

[Demo of what we will be building](https://app.tella.tv/video/ckvp7r624000009mq3h2h16po/embed)

## Setting up the Backend

In this section, we are going to set up our backend using Strapi. Strapi is an open-source headless CMS that allows to bootstrap RESTful API in a matter of minutes.

Additionally, it comes with a GUI (CMS), which helps manage different content types. This makes Strapi a great choice to quickly build an application and manage content.

**Creating a Strapi Project**
To create a Strapi project, run one of the following commands in your terminal.

```bash
    yarn create strapi-app@latest headless-blog --quickstart
    #OR
    npx create-strapi-app@latest headless-blog --quickstart
```

Using the `--quickstart` flag will set Strapi to use an SQLite database under the hood to skip setting up a database instance.

After the Strapi project has been created, in the same terminal, move into the newly created project by typing.

```
    cd headless-blog
```

And run the project in the development mode using either of the following commands.

```bash
    yarn develop
    # OR
    npm run develop
```

After running the above command, you will be taken to [http://localhost:1337/admin](http://localhost:1337/admin) to create the first administrator account.

Fill in the necessary details.

![](resources/01-strapi-login.png)

After you have filled in the details, you will be taken to the admin panel.

![](resources/02-strapi-dashboard.png)

We are good to go!

**Creating Collection Types**

Collection Types in Strapi are the content type that is used to define the structure to hold data. You can analogize this to be tabled in a database.

To create a Collection, Strapi comes built-in with a [Content-Type Builder](https://docs.strapi.io/user-docs/latest/content-types-builder/introduction-to-content-types-builder.html). The Content-Types Builder can be accessed from `Plugins > Content-Types Builder` in the main navigation of the admin panel.

![](resources/03-content-builder.png)

Let's breakdown the collections we are going to create with their fields

1. Category - the different categories of posts

- Name
- Slug

1. Author - the writer of the Post

- Name
- Bio
- Image

1. Post - the content

- Title
- Content
- Featured Image
- Excerpt
- Reading Time - (this we will automatically update based on the content)
- Slug
- Categories
- Author

You might notice the relationship between the Post to Category and Author. Hence let's initially create Category and Post collection types.

To create our first collection type, click on the Create new collection type button on the `Content-Type` Builder.

A modal (popup) will come up, and you will be prompted to enter the name of the collection type. Keep in mind to name it in the singular, as Strapi automatically pluralizes the word. Click on Continue.

![](resources/04-create-collection-type.png)

Moving on, you will behave to choose the different field types for the fields we have previously discussed. Select Text.

![](resources/05-category.png)

In the following modal, type Name in the name field, select Short Text, and click Add another field.

![](resources/06-add-text.png)

Follow the same for all the other fields we discussed earlier. I will not create all the fields in this tutorial, but I am leaving a couple of screenshots of the collection fields for you to follow.

**Note:** You can omit the post relation in the Category collection as it gets automatically created after we link Category with Post.

If you want to know yourself familiarized with different Field types and the relations between Collection types, read [this section of the Strapi documentation](https://docs.strapi.io/user-docs/latest/content-types-builder/configuring-fields-content-type.html). The documentation covers the types of the different fields why you would choose to use it.

**Creating Collection : Category**

![](resources/07-create-category.png)

**Creating Collection : Author**

![](resources/08-create-author.png)

**Creating Collection : Post**

![](resources/09-create-posts.png)

**Relationship : Author - Post**

![](resources/11-post-author-relation.png)

**Relationship : Category - Post**

![](resources/10-post-category-relation.png)

**Setting up Roles and Permission**

Strapi creates CRUD endpoints for all the collection types, but by default, Strapi adds an authorization layer to these endpoints to which we need to grant public access explicitly.

We need to set up our roles and permission to have public access for our front end to fetch the posts. To do this, navigate to `Setting → Users & Permissions Plugin → Public`.

![](resources/12-permissions.gif)

Scroll down and tick the following checkbox under the Permissions section as shown in the below image and click on the Save button at the right top corner.

**Accessing the Post endpoints**

To access any API endpoint in Strapi, we need to append the pluralized name of the collection type to the base URL. In our case, to access the Post, the URL is [http://localhost:1337/posts](http://localhost:1337/api/posts). Since we allowed public access to the /posts endpoints, we can access this endpoint. You will see an empty array JSON response if you visit the endpoint since we did not add any posts yet.

```json
{
  "data": [],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 0,
      "total": 0
    }
  }
}
```

But before we move further, let modify the Post functionality to automatically add the reading time when a post is created or updated. This can be achieved by modifying the model of Post collection.

**Adding Reading time to Post collection**

Strapi, by default, is extensible; hence it allows us to modify the functionality as we like it. That is why I prefer to see Strapi than more of framework + headless CMS rather than just a headless CMS.

To better understand a Strapi project, look at the [Project Structure documentation](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/file-structure.html) and the [Backend customization](https://docs.strapi.io/developer-docs/latest/development/backend-customization.html) in the Strapi documentation. There is also a great article on the Strapi blog regarding [Content Modelling in Strapi](https://strapi.io/blog/content-modelling-bite-sized-guide).

To get started, open your Strapi project in your favorite code editor. For this tutorial, I am going to stick to VS Code. After you have opened up the project if you have stopped the Strapi server, restart using `yarn develop`.

Models are a representation of the database's structure. The post.js we will be editing contain [lifecycle hooks](https://docs.strapi.io/dev-docs/backend-customization/models#lifecycle-hooks) or functions triggered when the Strapi queries are called, or any database interactions are made. In our case, we need to update the reading time when a post is created or updated.

Navigate to `src/api/post/content-types/post` and create a new file called `lifecycles.js` and paste the following code.

```javascript
const readingTime = require("reading-time");

module.exports = {
  async beforeCreate(event) {
    console.log("########## BEFORE CREATE ##########");
    console.log(event);
    console.log(event.model.uid);
    console.log(event.params.data);

    event.params.data.readingTime =
      readingTime(event.params.data.content)?.text || null;
  },

  async beforeUpdate(event) {
    console.log("########## BEFORE UPDATE ##########");
    console.log(event);
    console.log(event.model.uid);
    console.log(event.params.data);

    event.params.data.readingTime =
      readingTime(event.params.data.content)?.text || null;
  },
};
```

We are utilizing the `beforeCreate` and `beforeUpdate` hooks to check if there is content present and, if so, to use the [reading-time](https://www.npmjs.com/package/reading-time) package to calculate the reading time and update the `readingTime` field we configured when we made the Post collection.

If you know different hooks available in Strapi, check out [Understanding the different types/categories of Strapi Hooks](https://strapi.io/blog/understanding-the-different-types-categories-of-strapi-hooks) article on the in-depth guide in working with Strapi hooks.

For this change to take effect and not throw an error, stop the Strapi server and install the `reading-time` package. Open your terminal and type the following command.

```bash
    yarn add reading-time
    #OR
    npm i reading-time
```

To restart start the server type yarn develop or npm run develop

**Finalizing the backend**

We are done with all the needed configuration and setup for our Strapi backend. Before moving to the frontend, let's insert categories and authors and associate them with the respective posts. 

Go ahead and create few posts, categories and authors.

I have gone ahead and added five posts and created the respective authors and categories.

![Posts]()

Before we move on to our frontend, let look at how /posts API endpoints to view our JSON response.

[http://localhost:1337/posts](http://localhost:1337/api/posts?populate=*)


```
    
```

Let go forth, my friends, to the front end!

## **Setting up an Astro Project**

Since we have completed the API using Strapi, let's move on and, in this section, build the frontend functionality with Astro.

First off, let got ahead and create the project directory and move into the directory. For this tutorial, let's call our blog, AstroBlog.

```bash
    mkdir astro-blog && cd astro-blog
```

To create your Astro project, open your terminal and run either of the following commands based on the package manager of your choice:

```
    # With NPM
    mkdir astro-blog && npm init astro

    # Yarn
    yarn create astro
```

![](https://paper-attachments.dropbox.com/s_25158760999C363C0CEB83910E101D2BF43A000DD0C988A562E876F1C34E4CCB_1635658966266_image.png)

You can choose a framework of your choice, but to follow along with this tutorial, choose React and wait for the step to finish.

![](https://paper-attachments.dropbox.com/s_25158760999C363C0CEB83910E101D2BF43A000DD0C988A562E876F1C34E4CCB_1635658986541_image.png)

As the next steps, follow the instructions given. Step 2 is optional.

![](https://paper-attachments.dropbox.com/s_25158760999C363C0CEB83910E101D2BF43A000DD0C988A562E876F1C34E4CCB_1635659098191_image.png)

```bash
      1: npm install (or pnpm install, yarn, etc)

      # optional
      2: git init && git add -A && git commit -m "Initial commit"

      3: npm run dev (or pnpm, yarn, etc)
```

After running Step 3 and going to [http://localhost:3000/](http://localhost:3000/), this is what you will see.

![](https://paper-attachments.dropbox.com/s_25158760999C363C0CEB83910E101D2BF43A000DD0C988A562E876F1C34E4CCB_1635697579756_image.png)

Cool! The installation is complete. Stop the dev server and open the project folder using your favorite code editor or IDE. As always, we will be using VS Code.

**Setting up the frontend**

You can examine the folder structure by clicking on the file explorer icon (left side, first icon) to explore the folder structure.

![](https://paper-attachments.dropbox.com/s_25158760999C363C0CEB83910E101D2BF43A000DD0C988A562E876F1C34E4CCB_1635673572956_image.png)

One thing you might find new is the .astro files. Astro, as mentioned in the introduction, comes with its component file. Similar to frameworks such as Vue, it is a single-file component where the file houses all of the JS, HTML, and styles as one single file.

Astro also scopes each style to its relevant component, so they do not leak to other components. If you are interested in knowing more about the folder structures and files of Astro, visit [this part](https://docs.astro.build/core-concepts/project-structure/) of the section in the Astro documentation.

Before we get started, we get started on developing. Let's set up [Tailwind](https://tailwindcss.com/), a utility first CSS framework, the [React renderer](https://www.npmjs.com/package/@astrojs/renderer-react) for Astro, and the Astro plugin supporting React.

Heads up!

Astro supports other frameworks and styling options. We are choosing React and Tailwind for this tutorial. If you want to learn more about the other options, check for other renderers and styling options.

**Setting up Tailwind CSS**

Open up a terminal in the root of the project and run the following command to install Tailwind CSS:

```bash
    npm install --save-dev tailwindcss
```

After the installation is complete, run the following command to create the necessary config files for Tailwind. Running this command will create a minimal `tailwind.config.js` file at the root of your project:

```bash
    npx tailwindcss init
```

Open up the newly created `tailwind.config.js` and modify it according to the following parts.

```
    module.exports = {
      mode: 'jit',
      purge: ['./public/**/*.html', './src/**/*.{astro,js,jsx,svelte,ts,tsx,vue}'],
      // ...other options come here
    };
```

Astro's built-in Tailwind support only works with Tailwind JIT mode, and the purge key denotes paths the Tailwind compiles should look to remove unused CSS classes from the production build.

If you want to learn more about this optimization, check these [Tailwind docs](https://tailwindcss.com/docs/optimizing-for-production). We will be coming back to this file later again to install some Tailwind plugins hence the comment.

One last configuration, and we are good to have Tailwind in our toolbelt to use.

Next open `astro.config.mjs` and add the following snippet of code. This enables Astro to support JIT in the dev server.

```
      export default {
    +   devOptions: {
    +     tailwindConfig: './tailwind.config.js',
    +   },
      };
```

**Include Tailwind in your CSS**

That is the last configuration we need to get Tailwind CSS working, and now we have to include Tailwind in your css.

1. Create a global stylesheet under `src/styles/global.css` and add the usual [@tailwind directives](https://tailwindcss.com/docs/installation#include-tailwind-in-your-css)

```
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
```

2. Import this CSS file in the `<head>` to your index.astro file

```
    <head>
      <link rel="stylesheet" href={Astro.resolve('../styles/global.css')}>
    </head>
```

3. Finally open up your terminal and run the following to start the dev server.

```bash
    yarn dev
```

**Creating the layout**

I quickly drew a simple mockup to visually what we will be building. To keep things simple and straight forward let building only two pages

1. Blog listing page
2. Single blog item page

The blog listing page will roughly look like below.

![](https://paper-attachments.dropbox.com/s_25158760999C363C0CEB83910E101D2BF43A000DD0C988A562E876F1C34E4CCB_1636025422034_Astro+Listing.png)

The single blog item would look this below

![](https://paper-attachments.dropbox.com/s_25158760999C363C0CEB83910E101D2BF43A000DD0C988A562E876F1C34E4CCB_1636026610718_Single+Blog+page.png)

First and foremost, let start creating the base layout so we can reuse the common page layouts. Create an Astro component under `/src/layout/BaseLayout.astro` and copy the following block of code.

```
    ---
    let title = 'Blog';
    ---
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <title>{`StrapiAstro| ${title}`}</title>
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
           <link rel="stylesheet" type="text/css" href={Astro.resolve("../styles/global.css")}>
    </head>
    <body>
        <main>
            <header class="shadow mb-8">
                <div>
                    <a href="/" class="block text-black text-2xl font-bold text-center py-4">
                        Astro Blog
                    </a>
                </div>
            </header>
            <div class="container mx-auto my-4">
                <slot/>
            </div>
        </main>
    </body>
    </html>
```

You might find these very familiar to the index.astro page with a few additions because it is. We just abstracted all the code and deleted what we didn't need.

One thing to notice is that all of this code is wrapped between two `--- /` code fences. This is the Frontmatter Script part of the Astro component, which allows dynamic building components.

If you want to learn more about the layouts in Astro, check [this](https://docs.astro.build/core-concepts/layouts/) section in the documentation.

**Building out the UI Components**

Before we start putting everything together, let's individually create all the UI necessary components. Having a look at the UI, I am going to create 3 components

1. BlogGrid
2. BlogGridItem
3. SingleBlogItem

Let's make use of React to build these components. Let's start by creating the following files under the `/src/components` directory.

**Creating the blog grid items.**

Create a file under `src\components\BlogGridItem.jsx` and copy the following lines of code

```
    import React from 'react';
    export default function BlogGridItem({ post }) {
        const { title, content, slug, featuredImage, excerpt, author } = post;
        return (
            <div className="rounded-md overflow-hidden shadow-sm p-4  transition-transform h-auto">
                <a href={`/post/${slug}`}>
                    <div className="rounded-md h-48 w-full overflow-hidden">
                        <img
                            className="object-cover w-full h-full"
                            src={
                                featuredImage
                                    ? `http://localhost:1337${featuredImage.url}`
                                    : 'https://via.placeholder.com/1080'
                            }
                        />
                    </div>
                    <div>
                        <h1 className="my-2 font-bold text-xl text-gray-900">{title}</h1>
                        <p className="my-2 text-gray-700 line-clamp-3">{excerpt}</p>
                    </div>
                    <div className="flex justify-between my-4 items-center">
                        <div className="flex space-x-2 items-center overflow-hidden">
                            <img
                                class="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                src={
                                    author?.bioImage?.url
                                        ? `http://localhost:1337${author?.bioImage?.url}`
                                        : 'https://via.placeholder.com/1080'
                                }
                                alt="author picture"
                            />
                            <p className="font-medium text-xs text-gray-600 cursor-pointer">{author?.name}</p>
                        </div>
                        <div class="inline-flex rounded-md ">
                            <a
                                href={`/post/${slug}`}
                                class="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-400"
                            >
                                Read article
                            </a>
                        </div>
                    </div>
                </a>
            </div>
        );
    }
```

By looking at that code, you might have deduced that BlogGridItem components accept a single post as a [prop](https://beta.reactjs.org/learn/passing-props-to-a-component).

In `line 3` we are destructing the prop to get all the keys from a single post. We had a look at the API response earlier for a single post. That is the same JSON key we are destructing in this line.

Another point to know is the `href` attribute of both `<a>` tag is pointing to `/post/slug`. This would make sense later on when we start creating pages.

We are appending the Strapi URL to the img src because Strapi does not append it by default.

**Creating the blog grids**

Create a file under `src\components\BlogGrid.jsx` and paste the following code

```
    import BlogGridItem from './BlogGridItem';
    export default function BlogGrid({ posts }) {
        return (
            <div className="grid grid-cols-3 gap-6">
                {posts && posts.length > 0 ? posts.map((post) => <BlogGridItem post={post} />) : 'No posts founds'}
            </div>
        );
    }
```

The `BlogGrid` component is a container with a list of `BlogGridItems`. You can notice it accepts a post, a prop, and maps it to the `BlogGridItem` component while passing the single Post as the post prop.

Creating the single blog item.

This particular component can be arguable to make as a page, but I will make this a component in this tutorial. Go ahead a create a file under `src\components\SingleBlogItem.jsx` and copy and paste the following lines of code.

```
    import { formatDistance, format } from 'date-fns';
    import ReactMarkdown from 'react-markdown';
    export default function SingleBlog({ post }) {
        const { title, content, featuredImage, created_at, updated_at, readingTime, author } = post || {};
        return (
            <>
                <div className="my-4 text-center">
                    <h1 className="text-center text-4xl leading-tight text-gray-900 my-4 font-bold">{title}</h1>
                    <div className="text-gray-500 flex justify-center items-center space-x-2">
                        <span className="flex space-x-2 items-center overflow-hidden">
                            <img
                                class="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                src={
                                    author?.bioImage?.url
                                        ? `http://localhost:1337${author?.bioImage?.url}`
                                        : 'https://via.placeholder.com/1080'
                                }
                                alt="author picture"
                            />
                            <p className="font-medium text-xs text-gray-600 cursor-pointer">{author?.name}</p>
                        </span>
                        <span>&middot;</span>
                        <span>{format(new Date(created_at), 'MM/dd/yyyy')}</span>
                        <span>&middot;</span>
                        <span>{readingTime}</span>
                    </div>
                </div>
                <div className="rounded-md h-56 w-full overflow-hidden">
                    <img
                        className="object-cover w-full h-full"
                        src={
                            featuredImage ? `http://localhost:1337${featuredImage.url}` : 'https://via.placeholder.com/1080'
                        }
                    />
                </div>
                <article className="prose  max-w-full w-full my-4">
                    <ReactMarkdown
                        components={{
                            img: (props) => {
                                const copyProps = { ...props };
                                if (!props?.src.includes('http')) {
                                    copyProps.src = `http://localhost:1337${props?.src}`;
                                }
                                return <img {...copyProps} />;
                            },
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </article>
            </>
        );
    }
```

You might notice that we have to install to packages react-markdown and date-fns. We have to install react-markdown because, as discussed earlier, Strapi's rich text editor by default only supports Markdown, but you always have the options to replace it with a text editor of your choice.

We are installing date-fns because it's a lightweight date manipulating library. We are using it here to show how old the Post has been since posting.

Note: Astro components by default supports Markdown. Since we use React to make the components, we need to install a library to handle Markdown.

Let's go ahead and install this library. Open your terminal in the project directory or if you are using VS Code, open your terminal and paste the following command.

```bash
    yarn add react-markdown date-fns
```

Further looking at the code, you might notice that we are overriding the default img component to add the local Strapi Url here as well.

## Creating the Pages

We are finally ready to create the pages to put everything together. We have already interacted with the `index.astro` page earlier.

Unlike other Astro components, the files in the `.astro` inside the pages directory handle routing, data loading, and templating.

Like all popular frameworks, Astro is also based on file-based routing, meaning, every `.astro` file you create in the pages directory is treated as a route.

Note: `.md` files are also treated as routes if created inside pages directory, but any other file extensions are not. You can find more about Astro [pages](https://docs.astro.build/core-concepts/astro-pages/) here in the documentations.

**Creating the main page**

To build our main page, open your `index.astro` file and paste the following lines of code.

```
    ---
    // Component Imports
    import BaseLayout from "../layout/BaseLayout.astro"
    import BlogGrid from "../components/BlogGrid.jsx"
    const posts  =  await fetch(`http://localhost:1337/posts`).then(res => res.json())
    ---
    <BaseLayout>
        <BlogGrid posts={posts}/>
    </BaseLayout>
```

Since we have already abstracted most of the code from the initial `index.astro` file, we have replaced it with the `BaseLayout` component.

With the couple-few lines in the top, we imported the needed components, the `BaseLayout` and the `BlogGrid`. Keep in mind this was one is Astro component and the other is React component, the awesome power of Astro!

Following that we are using fetch to send a request to Strapi to pull all the blog posts. Since Astro supports top-level await, we do not need to have an async function.

Let move to the single post item.

**Creating a single blog item page**

Since Astro uses file-based routing, it supports dynamic parameters using `[bracket]` notation into the filename. This allows mapping a specific file to make different routes.

Create a file under `pages/blog/[slug].astro`. Because this has bracket notation, this route will be mapped to anything that follows `/Post`. Eg: `/post/hello-world, /post/lorem-ipsum`, etc.

Copy the following lines of code to the newly created files

```
    ---
    import BaseLayout from "../../layout/BaseLayout.astro"
    import SingleBlogItem from "../../components/SingleBlogItem.jsx"

    export async function getStaticPaths() {
       const posts  =  await fetch(`http://localhost:1337/posts`).then(res => res.json())
      return  posts.map(post =>  ({params : {slug:post.slug}}))
    }

    const {slug} =  Astro.request.params
    const postItem = await fetch(`http://localhost:1337/posts?slug=${slug}`).then(x  => x.json())
    ---

    <BaseLayout title={postItem[0]?.title}>
    <SingleBlogItem post={postItem[0]}/>
    </BaseLayout>
```

One important thing to keep in mind is that pages using dynamic routes must export a [getStaticPaths()](https://docs.astro.build/reference/api-reference/#getstaticpaths) function returning all the names of the `files/pages` it should generate. If you have a background in Next.js and a simple framework, you might be familiar with this concept.

In the `getStaticPaths()` function, we are doing similar to what we did in the `index.astro` file getting all the Post, but this Time we return only the slug as a request parameter.

If you recall, when creating the blog grid item component, we had a `href` that pointed to `/posts/${slug}`, in that we realized the slug changes based on the Post. That particular anchor tag points to the page we just created.

We extract the slug parameter from the URL using the handy Astro.request.params object to get the exact Post. We query Strapi for the Post by slug, using Strapi's [Content API filters](https://strapi.io/documentation/developer-docs/latest/developer-resources/content-api/content-api.html#filters). This is why we never implemented a custom endpoint to get the Post by the slug.

Moving to the HTML part of the component, we simply wrap the `SingleBlogItem` component with the `BaseLayout` while passing the queried Post as props to the component. The `BaseLayout`, an Astro component, still accepts props we declared earlier in the frontmatter script.

And we are done! Pat yourself in the back and start up the dev server using `yarn dev`

## Conclusion

In this tutorial, we looked that how we can use Strapi and Astro to build a simple blog which super fast, SEO friendly, and, most importantly, ships no JavaScript.

We were able to build a complete backend using Strapi in a matter of minutes rather than spending Time figuring out building the APIs, handling image uploads, and building a GUI to manage posts.

Using Astro, we could get started by simply using our knowledge on React and making a complete blog site. If you are further interested in deploying to any static hosting, you can follow the [deployment guide](https://docs.astro.build/guides/deploy/) given by Astro

You can find the complete code for this tutorial here on GitHub. You can also find me on Twitter, LinkedIn, and GitHub.

Drop a comment to let me know what you thought of this article.
