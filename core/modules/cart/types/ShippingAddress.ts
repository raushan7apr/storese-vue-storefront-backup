export default interface ShippingAddress {
  firstname: string,
  lastname: string,
  city: string,
  regionId: string | number,
  postcode: string,
  street: string[]
}
