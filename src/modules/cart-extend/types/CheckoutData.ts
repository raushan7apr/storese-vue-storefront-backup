// import ShippingDetails from '@vue-storefront/core/modules/checkout/types/ShippingDetails'

import ShippingMethod from './ShippingMethod'
import PaymentMethod from './PaymentMethod'
// import PaymentDetails from '@vue-storefront/core/modules/checkout/types/PaymentDetails'
import ShippingDetails from '../../checkout-extend/types/ShippingDetails';
import PaymentDetails from '../../checkout-extend/types/PaymentDetails';

export default interface CheckoutData {
  shippingDetails: ShippingDetails,
  shippingMethods: ShippingMethod[],
  paymentMethods: PaymentMethod[],
  paymentDetails: PaymentDetails,
  taxCountry?: string
}
