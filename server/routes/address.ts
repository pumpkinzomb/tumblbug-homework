import express from "express";
import { LocalStorage } from "node-localstorage";

const router = express.Router();
const localStorage = new LocalStorage("./address");
/**
 * 주소목록 json형태로 초기값 셋팅
 * localstroage를 이용한 데이터 CRUD 구현
 */
const ADDRESS_DB = require("./../address.json");
localStorage.setItem("address", JSON.stringify(ADDRESS_DB));
router.use("/*", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader("Expires", "-1");
  res.setHeader("Cache-Control", "must-revalidate, private");
  next();
});

/**
 * Address 주소 페이지별 갯수 가져오기
 */
router.get("/address/:count/:currentpage", (req: express.Request, res: express.Response) => {
  const { count, currentpage } = req.params;
  const DB = JSON.parse(localStorage.getItem("address") || "");
  const first = (Number(currentpage) - 1) * Number(count);
  const end = first + Number(count);
  return res.json({
    address: DB.slice(first, end),
    count,
    currentpage,
    totalCount: DB?.length,
  });
});

/**
 * Address 신규추가
 */
router.post("/address", (req: express.Request, res: express.Response) => {
  let DB = JSON.parse(localStorage.getItem("address") || "");
  let newAddress: any = req.body.newAddress;
  newAddress.id = DB[DB.length - 1].id + 1;
  DB.push(newAddress);
  localStorage.setItem("address", JSON.stringify(DB));
  return res.json({
    address: newAddress,
    totalCount: DB?.length,
  });
});

/**
 * 특정 Address 삭제
 */
router.delete("/address/:id", (req: express.Request, res: express.Response) => {
  let DB = JSON.parse(localStorage.getItem("address") || "");
  const { id } = req.params;
  DB = DB.filter((address: any) => address.id !== Number(id));
  console.log(DB);
  localStorage.setItem("address", JSON.stringify(DB));
  return res.send(true);
});

module.exports = router;
