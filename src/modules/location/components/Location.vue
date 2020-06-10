<template>
  <div class="location">
    <div class="address-wrap" ref="addressWrap">
      <div class="static-wrap">
        <i class="material-icons">place</i>
        <span>Delivering to</span>
        <i class="material-icons">arrow_forward</i>
        <div class="dynamic-address">
          {{ selectedAddress }}
        </div>
        <i class="material-icons">arrow_drop_down</i>
      </div>
    </div>
    <div :class="[showLocationWrap ? 'location-content' : 'location-content-hide']">
      <span class="loc-main-title">Choose Delivery location</span>
      <div id="form-wrap">
        <form class="search-fld">
          <img class="search-img"
               alt="search location"
               src="https://cdn.shopify.com/s/files/1/0385/5889/2171/files/StoreSe_App-113.png?v=1589971320"
          >
          <input aria-label="search location" ref="address" type="text" id="search-rest" placeholder="search location" class="pac-target-input" autocomplete="off">
        </form>
        <button class="detect-btn btn" ref="detectBtn" @click="detectLocation">
          <img src="https://cdn.shopify.com/s/files/1/0385/5889/2171/files/StoreSe_App-114.png?v=1589971320" alt="detect location"> Detect
        </button>
      </div>
      <span class="error-message">{{ errorMessage }}</span>
      <div class="loc-footer-wrap">
        <span>Now delivering in Bangalore &amp; Delhi-NCR</span>
        <span>Launching soon in Hyderabad, Lucknow, Jaipur &amp; many more cities.</span>
      </div>
      <div class="footerbutton" style="display: none;">
        <button class="nobutton btn">
          No
        </button>
        <button class="yesbutton btn">
          Yes
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import rootStore from '@vue-storefront/core/store'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { OrderModule } from '@vue-storefront/core/modules/order'
import { Logger } from '@vue-storefront/core/lib/logger'
import { LocationService } from '@vue-storefront/core/data-resolver/LocationService';

export default {
  name: 'LocationInput',
  data: function () {
    return {
      selectedAddress: 'Choose Location',
      locationSearch: '',
      showLocationWrap: true,
      errorMessage: '',
      latitude: 0,
      longitude: 0,
      defaultLat: 12.9716,
      defaultLng: 77.5946,
      storedLocationInfo: {}
    }
  },
  mounted () {
    this.setAddressAutoComplete()
  },
  methods: {
    clearCart (place, latitude, longitude) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: i18n.t('Changing location will clear your cart. Do you wish to continue?'),
        action1: { label: i18n.t('Cancel'),
          action: () => {
            this.showLocationWrap = false
            this.locationSearch = '';
          }
        },
        action2: { label: i18n.t('OK'),
          action: async () => {
            // We just need to clear cart on frontend and backend.
            // but cart token can be reused
            await this.$store.dispatch('cart/clear', { disconnect: false });
            this.selectedAddress = place.name;
            this.updateAddress(latitude, longitude);
            this.getStores(latitude, longitude);
          }
        },
        hasNoTimeout: true
      })
    },
    setAddressAutoComplete () {
      let autocomplete = new google.maps.places.Autocomplete(
        (this.$refs.address),
        { types: ['geocode'] }
      );
      if (autocomplete) {
        let locationData = JSON.parse(window.localStorage.getItem('user_add_data'));
        autocomplete.setFields(['place_id', 'geometry', 'name']);
        autocomplete.addListener('place_changed', () => {
          let place = autocomplete.getPlace();
          console.log('place coming', place);
          let latitude = place.geometry.location.lat();
          let longitude = place.geometry.location.lng();
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          console.log(latitude, 'latitude');
          console.log(longitude, 'longitude');
          if (locationData) {
            this.clearCart(place, latitude, longitude);
          } else {
            this.getStores(latitude, longitude);
          }
        });
      }
      this.initLocation();
      this.$refs.addressWrap.addEventListener('click', () => {
        let locationData = JSON.parse(window.localStorage.getItem('user_add_data'));
        if (!locationData) {
          return;
        }
        this.showLocationWrap = !this.showLocationWrap;
        this.showLocationWrap ? this.preventBodyScroll(true) : this.preventBodyScroll(false);
      });
    },
    initLocation () {
      let locationData = JSON.parse(window.localStorage.getItem('user_add_data'));
      if (!locationData) {
        this.showLocationWrap = true;
        this.preventBodyScroll(true);
      } else {
        // when you have location
        this.storedLocationInfo = locationData;
        this.showLocationWrap = false;
        this.updateAddress(locationData.lat, locationData.lng, true);
      }
    },
    detectLocation () {
      window.localStorage.setItem('location_set', JSON.stringify(false));
      this.getGeoLocation(true);
    },
    getGeoLocation (flag) {
      if (flag) {
        try {
          if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
          } else {
            navigator.geolocation.getCurrentPosition(this.onLocationSuccess, this.onLocationError);
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log('location data')
        if (this.storedLocationInfo) {
          this.latitude = this.storedLocationInfo.lat;
          this.longitude = this.storedLocationInfo.lng;
          this.getStores(this.latitude, this.longitude, true, '');
          this.updateAddress(this.latitude, this.longitude, true)
        } else {
          try {
            if (!navigator.geolocation) {
              alert('Geolocation is not supported by your browser');
            } else {
              navigator.geolocation.getCurrentPosition(this.onLocationSuccess, this.onLocationErrorWithoutAlert);
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    },
    onLocationSuccess (position) {
      window.localStorage.setItem('location_set', JSON.stringify(true));
      console.log('position', position);
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;

      this.updateAddress(this.latitude, this.longitude, false);
      this.getStores(this.latitude, this.longitude, true, this.locationSearch);
    },
    onLocationError (error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          //alert('Location is mandatory to proceed.');
          this.showNotification('Location is mandatory to proceed');
          break;
        case error.POSITION_UNAVAILABLE:
          alert('Unable to retrieve your location. Please check your permissions.');
          break;
        case error.TIMEOUT:
          alert('The request to get user location timed out. Please try again');
          break;
        case error.UNKNOWN_ERROR:
          alert('An unknown error occurred for location permissions. Please reload the page.');
          break;
        default:
          alert('An unknown error occurred for location permissions. Please reload the page.');
          break;
      }
      let locationData = JSON.parse(window.localStorage.getItem('user_add_data'));
      if (locationData) {
        this.updateAddressWithoutAPI(locationData.lat, locationData.lng)
      } else {
        if (this.selectedAddress) this.selectedAddress = 'Choose location';
        this.locationSearch = '';
      }
    },
    onLocationErrorWithoutAlert (error) {
      this.updateAddress(this.defaultLat, this.defaultLng, true);
    },
    updateAddressWithoutAPI (lat, lng) {
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(lat, lng);
      const request = {
        latLng: latlng
      };

      geocoder.geocode(request, (results, status) => {
        if (results && results.length) {
          this.locationSearch = results[0].formatted_address;
          this.selectedAddress = results[0].formatted_address;
        }
      });
    },
    updateAddress (lat, lng, apiNotReqd) {
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(lat, lng);
      const request = {
        latLng: latlng
      };

      geocoder.geocode(request, (results, status) => {
        if (results && results.length) {
          console.log(results);
          this.locationSearch = results[0].formatted_address;
          this.selectedAddress = results[0].formatted_address;
          console.log('results[0].formatted_address', results[0].formatted_address);
          console.log('flag', apiNotReqd);
        }
      });
    },
    getStores (lat, lng) {
      this.errorMessage = '';
      fetch(`https://gdlugd95yi.execute-api.ap-south-1.amazonaws.com/api/getStoreByLocation?lat=${lat}&lng=${lng}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          response.json().then(response => {
            console.log(response.stores);
            let locationObj = {
              lat: lat,
              lng: lng,
              url: response.stores[0].storeAppUrl
            }
            window.localStorage.setItem('user_add_data', JSON.stringify(locationObj));
            if (response.stores[0].storeAppUrl === window.location.href) {
              this.showLocationWrap = false;
              this.preventBodyScroll(false);
            }
            window.location.href = response.stores[0].storeAppUrl;
          });
        } else {
          this.errorMessage = 'Sorry!We don\'t serve at your location currently.';
          let locationData = JSON.parse(window.localStorage.getItem('user_add_data'));
          if (locationData) {
            this.updateAddressWithoutAPI(locationData.lat, locationData.lng);
          } else {
            this.locationSearch = '';
            this.selectedAddress = 'Choose Location';
          }
          if (!locationData) {
            this.preventBodyScroll(true);
            this.showLocationWrap = true;
          }
        }
      }).catch(error => {
        this.errorMessage = 'Sorry!We don\'t serve at your location currently.';
      })
    },
    preventBodyScroll (flag) {
      let body = document.getElementsByTagName('body')[0];
      flag ? body.style.overflow = 'hidden' : body.style.overflow = 'auto';
    },
    showNotification (message) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t(message),
        action1: { label: this.$t('OK'), action: 'close' },
        hasNoTimeout: true
      })
    }
  }
}
</script>

<style>
  .d-flex {
    display: flex;
  }
  .d-none {
    display: none;
  }
  .address-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 1;
    color: #fff;
  }

  .static-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dynamic-address {
    margin: 0 5px;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .location-content {
    display: flex;
    position: absolute;
    top: 57px;
    z-index: 9999;
    background-color: #fff;
    padding: 1rem;
    width: 350px;
    height: 213px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  }
  .location-content-hide {
    @extend .location-content;
    display: none;
  }
  .location-content:before {
    content: "";
    width: 0px;
    height: 0px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #ffffff;
    position: absolute;
    top: -10px;
  }
  .loc-main-title {
    color: #68bd48;
    font-size: 1.1rem;
    padding-top: 8px;
    font-weight: 600;
  }
  #form-wrap {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding-top: 0.65rem;
  }
  form.search-fld {
    border: 1px solid #ccc;
    width: 70%;
    position: relative;
  }
  img.search-img {
    width: 1.5rem;
    position: absolute;
    top: 7px;
    left: 5px;
  }
  input#search-rest {
    border: none;
    height: 39px;
    width: 80%;
    padding: 0 1rem 0 2rem;
    color: #000;
    max-width: 80%;
    line-height: 1.2;
    border-radius: 2px;
    font-size: 15px;
    font-family: Rajdhani,sans-serif;
    font-style: normal;
    font-weight: 500;
  }
  button.detect-btn.btn {
    padding: 7.5px 1rem;
    width: 30%;
    border: 1px solid #ccc;
    border-left: none;
    border-radius: 0;
    text-transform: capitalize;
    background-color: #fff;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  button.detect-btn.btn img {
    margin-right: 8px;
    width: 1.5rem;
  }
  span.error-message {
    color: red;
    font-weight: 300;
  }
  .loc-footer-wrap {
    padding-top: 1.7rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .loc-footer-wrap span:nth-child(1) {
    font-size: 1.1rem;
    font-weight: 900;
    color: #878585;
  }
  .loc-footer-wrap span:nth-child(2) {
    font-size: 0.9rem;
    color: #878585;
  }
  .overlay-wrap {
    position: absolute;
    width: 100%;
    height: 1000vh;
    background-color: #333;
    opacity: 0.7;
    display: none;
  }
  .btn, .product-form__item--payment-button .product-form__cart-submit {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: inline-block;
    width: auto;
    text-decoration: none;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 2px;
    padding: 8px 15px;
    background-color: #68bd48;
    color: #fff;
    font-family: Rajdhani, sans-serif;
    font-style: normal;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: normal;
    font-size: 13px;
  }
</style>
