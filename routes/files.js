const router = require("express").Router();
const { upload } = require("../middlewares");
const { tryToDo } = require("../lib");
const { getFile, putFile, check, findProd } = require("../controllers/files");

router.get("/checkfile", tryToDo(getFile));
router.post("/findprod", findProd);
router.post("/check", check);
router.put("/", upload.single("linkFile"), tryToDo(putFile));

module.exports = router;
