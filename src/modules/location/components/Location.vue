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
          <input :disabled="isFetchingLocation" aria-label="search location" v-model="locationSearch" ref="address" type="text" id="search-rest" placeholder="search location" class="pac-target-input" autocomplete="off">
        </form>
        <button class="detect-btn btn" ref="detectBtn" @click="detectLocation" :disabled="isFetchingLocation">
          <img src="https://cdn.shopify.com/s/files/1/0385/5889/2171/files/StoreSe_App-114.png?v=1589971320" alt="detect location"> Detect
        </button>
      </div>
      <div class="pt-10">
        <span class="error-message h5">{{ errorMessage }}</span>
      </div>
      <div class="loc-footer-wrap">
        <span>Now delivering in Delhi, Mumbai, Kolkata, Bengaluru, Indore, and Mysuru</span>
        <!-- <span>Launching soon in Hyderabad, Lucknow, Jaipur &amp; many more cities.</span> -->
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
    <div class="overlay-wrap" @click="handleOverlay" style="display: none"></div>
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
      selectedAddress: 'Choose location',
      defaultLocation: 'Choose location',
      locationValue: '',
      locationSearch: '',
      showLocationWrap: false,
      isFetchingLocation: false,
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
            this.showLocationWrap = false;
            this.locationSearch = '';
          }
        },
        action2: { label: i18n.t('OK'),
          action: async () => {
            // We just need to clear cart on frontend and backend.
            // but cart token can be reused
            this.selectedAddress = place.name;
            // await this.$store.dispatch('cart/clear', { disconnect: false })
            this.updateAddress(latitude, longitude);
            // this.getStores(latitude, longitude);
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
          if (locationData && this.quantity > 0) {
            this.clearCart(place, latitude, longitude);
          } else {
            this.updateAddress(latitude, longitude);
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
        this.showLocationWrap ? this.toggleOverlay(false) : this.toggleOverlay(true);
      });
    },
    initLocation () {
      let locationData = JSON.parse(window.localStorage.getItem('user_add_data'));
      if (!locationData) {
        this.showLocationWrap = true;
        this.preventBodyScroll(true);
        this.toggleOverlay(false);
      } else {
        // when you have location
        this.storedLocationInfo = locationData;
        this.showLocationWrap = false;
        this.selectedAddress = locationData.address;
        this.toggleOverlay(true);
        this.updateAddressWithoutAPI(locationData.lat, locationData.lng);
      }
    },
    detectLocation (event) {
      event.stopPropagation();
      event.preventDefault();
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
          this.updateAddress(this.latitude, this.longitude)
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
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      const gaData = {
        permissions: "allowed",
        latitude: this.latitude,
        longitude: this.longitude,
      }
      if (this.$ga) {
        this.$ga.event('Detect_Location', 'click', JSON.stringify(gaData));
      }
      this.updateAddress(this.latitude, this.longitude, false);
    },
    onLocationError (error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.showNotification('Location is mandatory to proceed. Please enable location in your browser settings');
          this.selectedAddress = 'Choose location';
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
      const gaData = {
        permissions: "denied",
        latitude: null,
        longitude: null,
        address: null,
      }
      if (this.$ga) {
        this.$ga.event('Detect_Location', 'click', JSON.stringify(gaData));
      }
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
          this.locationValue = results[0].formatted_address;
          // this.getStores(lat, lng);
        }
      });
    },
    updateAddress (lat, lng) {
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(lat, lng);
      const request = {
        latLng: latlng
      };

      geocoder.geocode(request, (results, status) => {
        if (results && results.length) {
          this.locationSearch = results[0].formatted_address;
          this.locationValue = results[0].formatted_address;
          this.getStores(lat, lng);
        }
      });
    },
    getStores (lat, lng) {
      if (this.isFetchingLocation) return;

      this.isFetchingLocation = true;
      fetch(`https://gdlugd95yi.execute-api.ap-south-1.amazonaws.com/api/getStoreByLocation?lat=${lat}&lng=${lng}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      }).then(response => {
        this.isFetchingLocation = false;
        if (response.ok) {
          response.json().then(response => {
            console.log(response.stores);
            let locationObj = {
              lat: lat,
              lng: lng,
              url: response.stores[0].storeAppUrl,
              address: this.locationValue
            }
            window.localStorage.setItem('user_add_data', JSON.stringify(locationObj));
            if (this.$ga) {
              this.$ga.event('StoreAvailable', 'search', JSON.stringify(locationObj));
            }
            if (response.stores[0].storeAppUrl === window.location.href) {
              this.showLocationWrap = false;
              this.preventBodyScroll(false);
            }
            else{
              window.location.href = response.stores[0].storeAppUrl;
            }
            this.selectedAddress = this.locationValue;
          });
        } else {
          // this.selectedAddress = this.defaultLocation;
          this.errorMessage = 'Sorry! We don\'t serve at your location currently.';
          let locationData = JSON.parse(window.localStorage.getItem('user_add_data'));
          let locationObj = {
            lat: lat,
            lng: lng,
            url: `https://gdlugd95yi.execute-api.ap-south-1.amazonaws.com/api/getStoreByLocation?lat=${lat}&lng=${lng}`,
            address: this.locationValue
          }
          if (this.$ga) {
            this.$ga.event('StoreUnavailable', 'search', JSON.stringify(locationObj));
          }
          /* if (locationData) {
            this.updateAddressWithoutAPI(locationData.lat, locationData.lng);
          } */
          if (!locationData) {
            this.preventBodyScroll(true);
            this.showLocationWrap = true;
          }
        }
      }).catch(() => {
        this.errorMessage = 'Sorry! We don\'t serve at your location currently.';
        this.isFetchingLocation = false;
      })
    },
    preventBodyScroll (flag) {
      let body = document.getElementsByTagName('body')[0];
      flag ? body.style.overflow = 'hidden' : body.style.overflow = 'auto';
    },
    toggleOverlay (remove) { // false means show
      let overlay = document.getElementsByClassName('overlay-wrap')[0];
      if (overlay) {
        remove ? overlay.style.display = 'none' : overlay.style.display = 'block';
      }
    },
    handleOverlay () {
      let locationData = JSON.parse(window.localStorage.getItem('user_add_data'));
      if (locationData) {
        this.showLocationWrap = false;
        this.toggleOverlay(true);
        this.preventBodyScroll(false);
      }
    },
    showNotification (message) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t(message),
        action1: { label: this.$t('OK'), action: 'close' },
        hasNoTimeout: true
      })
    }
  },
  computed: {
    quantity () {
      return this.$store.getters['cart-extend/getItemsTotalQuantity']
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
  .pt-10 {
    padding-top: 10px;
  }
  .location {
    display: flex;
    justify-content: center;
  }
  .address-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 1;
    color: #fff;
    padding: 5px 0;
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
    width: 330px;
    height: 175px;
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
    top: -9px;
  }
  .loc-main-title {
    color: #f04d24;
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
    width: 75%;
    padding: 0 1rem 0 2rem;
    color: #000;
    max-width: 80%;
    line-height: 1.2;
    border-radius: 2px;
    font-size: 15px;
    font-family: 'Helvetica';
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
    padding-top: 1.0rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .loc-footer-wrap span:nth-child(1) {
    font-size: 1.0rem;
    font-weight: 400;
    color: #878585;
    line-height: 1.5;
  }
  .loc-footer-wrap span:nth-child(2) {
    font-size: 0.9rem;
    color: #878585;
    line-height: 1.5;
    text-align: center;
    font-weight: 200;
  }
  .overlay-wrap {
    position: absolute;
    width: 100%;
    height: 100vh;
    background-color: #333;
    opacity: 0.7;
  }
  .btn {
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
    background-color: #DB5E32;
    color: #fff;
    font-family: 'Helvetica';
    font-style: normal;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: normal;
    font-size: 13px;
  }
</style>
