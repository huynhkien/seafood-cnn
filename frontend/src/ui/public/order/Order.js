import { memo, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Quantity } from "../../../components/Index";
import { updateCart, removeProductCart } from "../../../store/user/userSlice";
import withBaseComponents from "../../../hocs/withBaseComponents";
import { useSelector } from "react-redux";

const Order = ({ dispatch, variant, addQuantity = 1, price, name, pid, thumb }) => {
  const [quantity, setQuantity] = useState(addQuantity);

  const {currentCart} = useSelector(state => state.user);

  const handleQuantity = (number) => {
    if (+number >= 1) setQuantity(number);
  };

  const handleChangeQuantity = (flag) => {
    if (flag === 'minus' && quantity === 1) return;
    if (flag === 'minus') setQuantity((prev) => +prev - 1);
    if (flag === 'plus') setQuantity((prev) => +prev + 1);
  };

  useEffect(() => {
    dispatch(updateCart({ pid: pid, quantity, variant }));
  }, [quantity, dispatch, pid, variant]);
  const handleRemoveCart = async(id, variant) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      dispatch(removeProductCart({
        pid: id,
        variant: variant
      }
      ))
  }
 }
  return (
    <tr>
      {(!currentCart || currentCart.length === 0) && 
      <td colSpan={5}>Giỏ hàng trống</td>
      }
      <td className="product-thumbnail">
        <a href="shop-details.html">
          <img
            className="img__cart--page"
            src={thumb}
            alt="Product Thumbnail"
            width={50}
            height={50}
          />
        </a>
      </td>
      <td className="product-name">
          {name}
      </td>
      <td className="product-price">
        {variant}
      </td>
      <td>
        <Quantity
          quantity={quantity}
          handleQuantity={handleQuantity}
          handleChangeQuantity={handleChangeQuantity}
        />
      </td>
      <td className="product-subtotal">
        <span className="amount">{price.toLocaleString()} VNĐ</span>
      </td>
      <td className="product-subtotal">
        <span className="amount">{(price * quantity).toLocaleString()} VNĐ</span>
      </td>
      <td className="product-remove">
        <span onClick={() => handleRemoveCart(pid, variant)}><i><FaTrash color="red" /></i></span>
      </td>
    </tr>
  );
};

export default withBaseComponents(memo(Order));
