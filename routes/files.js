const router = require("express").Router();
const { upload } = require("../middlewares");
const { tryToDo } = require("../lib");
const { checkFile, check, findProd } = require("../controllers/files");

router.post("/findprod", findProd);
router.post("/check", check);
router.put("/checkfile", upload.single("linkFile"), tryToDo(checkFile));

module.exports = router;
