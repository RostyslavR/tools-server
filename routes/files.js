const router = require("express").Router();
const { upload } = require("../middlewares");

const { tryToDo } = require("../lib");
const {
  checkFile,
  check,
  findProd,
  csvPrepare,
  csvCombine,
} = require("../controllers/files");

router.post("/findprod", findProd);
router.post("/check", check);
router.post("/checkfile", upload.single("linkFile"), tryToDo(checkFile));

router.post("/csvprepare", upload.array("files"), tryToDo(csvPrepare));
router.post("/csvcombine", tryToDo(csvCombine));

module.exports = router;
