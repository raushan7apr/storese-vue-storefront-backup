//import OrderShippingDetails from '@vue-storefront/core/modules/cart/types/OrderShippingDetails'
import OrderShippingDetails from '../types/OrderShippingDetails';
import PaymentMethod from '@vue-storefront/core/modules/cart/types/PaymentMethod'
import ShippingMethod from '@vue-storefront/core/modules/cart/types/ShippingMethod'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import CheckoutData from '../types/CheckoutData';

const getDefaultShippingMethod = (shippingMethods: ShippingMethod[] = []): ShippingMethod => {
  const onlineShippingMethods = shippingMethods.filter(shippingMethod => !shippingMethod.offline)
  if (!onlineShippingMethods.length) return

  return onlineShippingMethods.find(shippingMethod => !!shippingMethod.default) || onlineShippingMethods[0]
}

const getDefaultPaymentMethod = (paymentMethods: PaymentMethod[] = []): PaymentMethod => {
  if (!paymentMethods || !paymentMethods.length) return

  return paymentMethods.find(item => item.default) || paymentMethods[0]
}

const createOrderData = ({
  shippingDetails,
  shippingMethods,
  paymentMethods,
  paymentDetails,
  taxCountry = currentStoreView().tax.defaultCountry
}: CheckoutData): OrderShippingDetails => {
  const country = shippingDetails.country ? shippingDetails.country : taxCountry
  const shipping = getDefaultShippingMethod(shippingMethods)
  const payment = getDefaultPaymentMethod(paymentMethods)

  return {
    country,
    shippingAddress: {
      firstname: shippingDetails.firstName,
      lastname: shippingDetails.lastName,
      city: shippingDetails.city,
      postcode: shippingDetails.zipCode,
      regionId: shippingDetails.region_id,
      street: [shippingDetails.streetAddress]
    },
    billingAddress: {
      firstname: paymentDetails.firstName,
      lastname: paymentDetails.lastName,
      city: paymentDetails.city,
      postcode: paymentDetails.zipCode,
      regionId: shippingDetails.region_id,
      street: [paymentDetails.streetAddress],
      countryId: paymentDetails.country
    },
    method_code: shipping && shipping.method_code ? shipping.method_code : null,
    carrier_code: shipping && shipping.carrier_code ? shipping.carrier_code : null,
    payment_method: payment && payment.code ? payment.code : null
  }
}

export default createOrderData
