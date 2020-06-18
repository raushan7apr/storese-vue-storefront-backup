export default interface BillingAddress {
  firstname: string,
  lastname: string,
  city: string,
  regionId: string | number,
  postcode: string,
  street: string[],
  countryId: string
}
