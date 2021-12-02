import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { OneProduct } from './ProductData'        //temp imgs
import style from './DetailInfo.module.css'
import { getOneProduct } from '../../api/productAPI'
import { selectCustomer } from '../../features/customerSlice'
import ToastMessage from "../ToastMessage/ToastMessage";

import { 
     createCart, 
     addToCart, 
     getCurrent
} from '../../api/cartAPI'

import {
     getFavourites,
     createFavouriteList,
     addFavourite,
     removeFavourite,
} from "../../api/favouriteAPI";

import {
     selectFavouriteList,
     addFavouriteToRedux,
     removeFavouriteFromRedux,
} from "../../features/favouriteSlice";

function DetailInfo({ id }) {

     const customer = useSelector(selectCustomer)                     //get current logged in customer
     const favouriteList = useSelector(selectFavouriteList) || [];    //get current favourite list

     const dispatch = useDispatch();

     const [color, setColor] = useState(0)
     const [sizeChoose, setSizeChoose] = useState('')
     const [product, setProduct] = useState({ size: [] })

     const changeColor = (index) => {
          setColor(index)
     }

     const changeSize = (index) => {
          setSizeChoose(index)
     }

     const handleAddToCart = () => {
          if (sizeChoose === '') {
               ToastMessage('error', 'Please choose a size!');
               return;
          }

          if (customer) {
               getCurrent(customer.id)
                    .then(res => {
                         // exist current cart in database
                         if (res) {
                              addToCartDatabase()
                         }
                         else {
                              createCart(customer.id).then(res => {
                                   addToCartDatabase()
                              })
                         }
                    })
                    .catch(err => {
                         // HANDLE GET ADD PRODUCT TO DATABASE FAILED HERE
                         ToastMessage('error', 'Something went wrong!');
                         console.log(err)
                    })
          }
          else {
               addToCartLocal()
          }
     }

     const addToCartLocal = () => {
          const sessionStorage = window.sessionStorage
          const cart = JSON.parse(sessionStorage.getItem('cart')) || []
          sessionStorage.setItem('cart', JSON.stringify([...cart, {
               id: product._id,
               size: product.size[sizeChoose],
               name: product.name,
               brand: product.brand,
               color: product.color,
               price: product.price
          }
          ]))
          ToastMessage('success', 'Added to cart successfully!');
     }

     const addToCartDatabase = () => {
          addToCart(
               customer.id,
               product._id,
               product.name,
               product.brand,
               product.price,
               product.size[sizeChoose],
               product.color,
               product.salePercent,
          )
          .then(res => {
               // HANDLE UPDATE UI WHEN ADD TO CART SUCCESSFULLY HERE
               ToastMessage('success', 'Added to cart successfully!');
          })
          .catch(err => {
               console.log(err)
               // HANDLE UPDATE UI WHEN ADD TO CART FAIL HERE
               ToastMessage('error', 'Add to cart failed!');
          })
     }

     const handleAddToFavorite = () => {
          if (customer) {
               addFavourite(customer.id, product._id).then((res) => {
                    dispatch(addFavouriteToRedux(product._id));
                    // HANDLE UPDATE UI WHEN ADD FAVOURITE SUCCESSFULLY HERE
                    ToastMessage('success', 'Favourite added successfully!');
               });
          } else {
               // HANDLE NOTIFY WHEN USER NOT LOGGED IN HERE
               ToastMessage('error', 'Please login to use this feature!');
          }
     };

     const hanleRemoveFromFavorite = () => {
          if (customer) {
               removeFavourite(customer.id, product._id).then((res) => {
                    // HANDLE UPDATE UI WHEN REMOVE FAVOURITE SUCCESSFULLY HERE
                    dispatch(removeFavouriteFromRedux(product._id));
                    ToastMessage('success', 'Favourite removed successfully!');
               });
          }
     };

     const isFavourite = () => {
          if (favouriteList.includes(product._id)) {
               return true;
          }
          return false;
     };

     useEffect(() => {
          getOneProduct(id)
               .then(res => {
                    setProduct(res)
               })
     }, [])

     return (
          <div className={style.container}>
               <h4 className={style.path}>Product / {product.name}</h4>

               <div className={style.infoContainer}>
                    <div className={style.imgWrapper}>
                         <div className={style.mainImg}>
                              <img src={OneProduct.src[color].img} />
                         </div>

                         <div className={style.colorThumb}>
                              {
                                   OneProduct.src.map((item, index) => (
                                        <div
                                             className={index === color ? `${style.colorItem} ${style.colorActive}` : style.colorItem}
                                             key={index}
                                             onClick={() =>
                                                  changeColor(index)
                                             }
                                        >
                                             <img src={item.img} />
                                        </div>
                                   ))
                              }
                         </div>
                    </div>
               
                    <div className={style.divide}></div>

                    <div className={style.infoWrapper}>
                         <div className={style.info}>
                              <h2 className={style.name}>{product.name}</h2>
                              <h4 className={style.brand}>{product.brand}</h4>
                              <h4 className={style.rating}>Rating: {product.rating}</h4>
                              <p className={style.price}>$ {product.price}</p>
                              <p className={style.description}>{product.description}</p>

                              
                              <h4 className={style.sizeText}>Size</h4>
                              <div className={style.sizeContainer}>
                                   {
                                        product.size.map((item, index) => (
                                             <div 
                                                  className={index === sizeChoose ? `${style.sizeItem} ${style.sizeActive}` : style.sizeItem}
                                                  key={index}
                                                  onClick={() =>
                                                       changeSize(index)
                                                  }
                                             >
                                                  {item}
                                             </div>
                                        ))
                                   }
                              </div>

                              <button className={style.btnAddToCart} onClick={handleAddToCart}>Add to cart</button>
                              <button 
                                   className={isFavourite() ? style.btnFavouriteActive : style.btnFavourite} 
                                   onClick={() => {
                                        // add if not favourite, remove if favourite
                                        if (isFavourite()) {
                                             hanleRemoveFromFavorite();
                                        } else {
                                             handleAddToFavorite();
                                        }
                                   }}>
                                   {isFavourite() ? 'Remove from favourite' : 'Add to favourite'}
                              </button>
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default DetailInfo