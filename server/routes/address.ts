import express from "express";
import { LocalStorage } from "node-localstorage";
interface Address {
  id: number;
  postnumber: number;
  name: string;
  address: string;
}
const router = express.Router();
const localStorage = new LocalStorage("./address");
/**
 * 주소목록 json형태로 초기값 셋팅
 * localstroage를 이용한 데이터 CRUD 구현
 * 서버 구동시 초기값으로 초기화됨
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
  return res.status(200).json({
    addresses: DB.addresses.slice(first, end),
    count,
    currentPage: currentpage,
    totalCount: DB.addresses?.length,
    default: DB.default,
  });
});

/**
 * Address 신규추가
 */
router.post("/address", (req: express.Request, res: express.Response) => {
  let DB = JSON.parse(localStorage.getItem("address") || "");
  let newAddress: Address = req.body.newAddress;
  newAddress.id = DB.addresses[DB.addresses.length - 1].id + 1;
  DB.addresses.push(newAddress);
  localStorage.setItem("address", JSON.stringify(DB));
  return res.status(200).json({
    addresses: newAddress,
    totalCount: DB.addresses?.length,
  });
});

/**
 * 특정 Address 삭제
 */
router.delete("/address/:id", (req: express.Request, res: express.Response) => {
  let DB = JSON.parse(localStorage.getItem("address") || "");
  const { id } = req.params;
  DB.addresses = DB.addresses.filter((address: Address) => address.id !== Number(id));
  localStorage.setItem("address", JSON.stringify(DB));
  return res.status(204).json(true);
});

/**
 * Address 기본주소 설정
 */
router.put("/address/default", (req: express.Request, res: express.Response) => {
  let DB = JSON.parse(localStorage.getItem("address") || "");
  DB.default = req.body.id;
  console.log(DB);
  localStorage.setItem("address", JSON.stringify(DB));
  return res.status(204).json(true);
});

module.exports = router;
