import { RootRoutes } from 'types/navigation';
import { LinkingOptions } from '@react-navigation/native';

import { browseScreens } from 'common/constants/browse';
import envConstants from 'app/config';

const linking: LinkingOptions<RootRoutes> = {
  prefixes: [
    `${envConstants.APP_URL_SCHEME}://`,
    `https://${envConstants.UNIVERSAL_DOMAIN}`,
    `http://${envConstants.UNIVERSAL_DOMAIN}`,
  ],
  config: {
    screens: {
      BottomNavStack: {
        path: '',
        screens: {
          HomeStack: {
            path: 'home',
            screens: {
              Sneakers: 'sneakers',
              Apparel: 'apparel',
              Collectibles: 'collectibles',
            },
          },
          BrowseStack: {
            path: '',
            screens: {
              BrowseRoot: {
                path: '',
                screens: browseScreens,
              },
              FilterRoot: {
                screens: {
                  Filter: 'filter',
                },
              },
            },
          },
          AccountStack: {
            screens: {
              Account: 'account',
              About: 'about',
            },
          },
        },
      },
      SearchStack: {
        screens: {
          Search: 'search',
        },
      },
      UserStack: {
        path: 'dashboard',
        screens: {
          Profile: {
            path: 'profile',
            screens: {
              User: '',
              Buying: 'buying',
              Selling: 'selling',
            },
          },

          Buying: {
            path: 'buying',
            screens: {
              Offers: '',
              ConfirmedPurchases: 'confirmed-purchases',
              PastPurchases: 'past-purchases',
            },
          },

          Selling: {
            path: 'selling',
            screens: {
              Lists: '',
              ConfirmedSales: 'confirmed-sales',
              PastSales: 'past-sales',
            },
          },

          Posts: {
            path: 'posts',
            screens: {
              PublishedPosts: '',
              ReviewingPosts: 'reviewing',
              RejectedPosts: 'rejected',
            },
          },

          BulkShipment: {
            path: 'selling/shipment',
            screens: {
              MakeBulkShipment: ':selected_refs/create',
              ConfirmedBulkShipment: ':shipment_id/confirmed',
              ShipmentDetails: ':shipment_id/details',
            },
          },

          BulkListEditStack: {
            path: 'selling/lists-edit',
            screens: {
              BulkListUpdate: 'view',
              BulkListReview: 'review',
              BulkListConfirmed: 'confirmed',
            },
          },

          PostEditStack: {
            path: 'post',
            screens: {
              PostCreate: 'create/:product_id',
              PostEdit: ':user_post_id/edit',
              PostTagSelection: 'select-tags',
            },
          },

          Storage: 'storage',
          PurchaseDetails: 'buying/:sale_ref',
          SaleDetails: 'selling/:sale_ref',
          PostDetails: 'posts/:user_post_id',

          PostPurchase: 'buying/:sale_ref/post-purchase/select',
          PostPurchaseConfirmed: 'buying/:sale_ref/post-purchase/confirmed',

          StoreInStorage: 'buying/:sale_ref/store-in-storage',
          StoreInStorageConfirmed: 'buying/:sale_ref/store-in-storage/confirmed',

          PayoutRequest: 'payout-request',
          PayoutHistory: 'payout-request/history',

          Wishlist: 'wishlist',
          Promotions: 'promotions',

          Settings: 'settings',
          BuyingForm: 'settings/buying-info',
          SellingForm: 'settings/selling-info',
          ProfileForm: 'settings/profile',
          SizePreferencesForm: 'settings/size-preferences',
          PasswordForm: 'settings/password',
          PhoneForm: 'settings/phone',
          PushNotificationForm: 'settings/push-preferences',
        },
      },
      AuthStack: {
        // @ts-ignore no proper type available to add param in a stack
        screens: {
          LogIn: 'login',
          SignUp: 'signup',
          ForgotPassword: 'password/forgot',
          ResetPassword: 'password/reset',
          SocialCallback: 'auth',
          SocialCallbackWeb: 'auth/*',
        },
      },
      StripePaymentHandler: 'safepay', // safepay is defined by stripe.

      // Events
      PowerSeller: 'power-seller',
      TravelWithNS: 'travel-with-novelship',
      PartnerSales: 'partner-sales/*',
      // todo: @deprecate later
      RaffleProductStackOld: {
        path: 'raffle/:slug',
        // @ts-ignore no proper type available to add param in a stack
        screens: {
          RaffleProduct: '',
          RaffleProductSizes: 'sizes',
          RaffleProductReview: 'review',
          RaffleProductConfirmed: ':id/confirmed',
        },
      },
      RaffleProductStack: {
        path: 'raffles/:slug',
        // @ts-ignore no proper type available to add param in a stack
        screens: {
          RaffleProduct: '',
          RaffleProductSizes: 'sizes',
          RaffleProductReview: 'review',
          RaffleProductConfirmed: ':id/confirmed',
        },
      },
      // -->

      ProductStack: {
        path: ':slug',
        // @ts-ignore no proper type available to add param in a stack
        screens: {
          Product: '',
          LookbookFeed: 'lookbook-feed',
          Sizes: ':flow/sizes',
          SizeChart: 'size-chart',
          SizesWishlist: 'size-wishlist',
          MakeOffer: 'buy/:offer_list_id/view',
          BuyReview: 'buy/:offer_list_id/review',
          DeliveryReview: 'buy/:sale_ref/review-delivery',
          PaymentSelect: 'buy/:offer_list_id/payment',
          PromocodeSelect: 'buy/:offer_list_id/promocode',
          ConfirmedOffer: 'buy/:id/confirmed',
          ConfirmedPurchase: 'buy/:id/confirmed-buy',
          ConfirmedDelivery: 'buy/:id/confirmed-delivery',
          MakeList: 'sell/:offer_list_id/view',
          SellReview: 'sell/:offer_list_id/review',
          ConsignReview: 'sell/consign/create',
          ConfirmedList: 'sell/:id/confirmed',
          ConfirmedSale: 'sell/:id/confirmed-sell',
          ConfirmedConsignment: 'sell/:id/confirmed-consign',
        },
      },
      NotFoundScreen: '*/*',
    },
  },
};

export default linking;
