const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const uuid = require("uuid").v4;
const cors = require("cors");

const app = express();
//跨域问题解决
app.use(cors());

//数据源
const articles = [
  {
    title: "文章一",
    author: "Hexi",
    content: "文章一的内容",
    id: "1",
  },
  {
    title: "文章二",
    author: "Hexi2",
    content: "文章二的内容",
    id: "2",
  },
  {
    title: "文章三",
    author: "Hexi3",
    content: "文章三的内容",
    id: "3",
  },
];

// 定义schema
const schema = buildSchema(`
  type Article{
      title: String!
      author: String!
      content: String!
      id: String!
  }
  type Query {
    articles: [Article]
    article(id:String!): Article
  }

  input updateArticleInput{
      title:String!
      author:String!
      content:String!
  }

  type Mutation{
      deleteArticle(id:String!):Article,
      addArticle(title:String!,author:String!,content:String!):Article
      updateArticle(id:String!,params:updateArticleInput!):Article
  }
`);

// 定义resolver
const rootValue = {
  articles: () => articles,
  article: (args) => {
    return articles.find((item) => item.id === args.id);
  },
  deleteArticle: (args) => {
    const deleteIndex = articles.findIndex((item) => item.id === args.id);
    const result = { ...articles[deleteIndex] };
    articles.splice(deleteIndex, 1);
    return result;
  },
  addArticle: (args) => {
    const { title, author, content } = args;
    const newArticle = {
      title,
      author,
      content,
      id: uuid(),
    };
    articles.push(newArticle);
    return newArticle;
  },
  updateArticle: (args) => {
    const { id, params } = args;
    const currentIndex = articles.findIndex((item) => item.id === id);
    params.id = id;
    articles.splice(currentIndex, 1, params);
    return params;
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    // 开启浏览器的GraphQL IDE调试工具
    graphiql: true,
  })
);

app.listen(5000, () => {
  console.log("GraphQL Server is running at http://localhost:5000/graphql");
});
