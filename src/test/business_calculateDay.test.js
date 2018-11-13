import * as business from "../hoc/business/business";

describe('Kiểm tra tính ngày tháng đã gửi tiết kiệm', () => {
  test('Tính số ngày đã gửi', () => {
    expect(business.getDurationDays('01/01/2017','02/11/2018')).toBe(670);
  })
  test('Tính số tháng đã gửi', () => {
    expect(business.getDurationMonths('01/01/2017','02/11/2018')).toBe(22);
  })
})