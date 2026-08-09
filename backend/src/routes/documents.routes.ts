import { Router } from "express";

const router = Router();
const documents = [
  {
    id: 1,
    title: "My first document",
  },
];

router.get("/", (req, res) => {
  res.json({
    message: "documet ",
    data:documents[0]
  });
});
router.post("/", (req, res) => {
    const newdoc = {
        id:2,
        title:"My second document"
    }
    documents.push(newdoc)
  res.json({
    message: "documet ",
    data:documents
  });
});
export default router;
