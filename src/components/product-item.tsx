
import { useState } from "react";
import toast from "react-hot-toast";
import { useAtomValue } from "jotai";
import TransitionLink from "./transition-link";
import { PlusAddCartIcon } from "./vectors";

import { useAddToCart } from "@/hooks";
import { productState } from "@/state";
import { Product } from "@/types";
import { formatPrice } from "@/utils/format";

export interface ProductItemProps {
  product: Product;
  /**
   * Whether to replace the current page when user clicks on this product item. Default behavior is to push a new page to the history stack.
   * This prop should be used when navigating to a new product detail from a current product detail page (related products, etc.)
   */
  replace?: boolean;
}

export default function ProductItem(props: ProductItemProps) {
  const [selected, setSelected] = useState(false);
  const product = useAtomValue(productState(Number(props.product.id)))!;
  const { addToCart } = useAddToCart(product);

  return (
    <TransitionLink
      className="flex flex-col cursor-pointer group"
      to={`/product/${props.product.id}`}
      replace={props.replace}
      onClick={() => void setSelected(true)}
    >
      {({ isTransitioning }) => (
        <div className="bg-white overflow-hidden rounded-xl min-w-[40vw]">
          <div className="relative  bg-gray-100 rounded-xl">
            <img
              src={props?.product?.image[0]}
              alt={props.product.name}
              className="w-full aspect-square object-cover rounded-xl"
              style={{
                viewTransitionName:
                  isTransitioning && selected // only animate the "clicked" product item in related products list
                    ? `product-image-${props.product.id}`
                    : undefined,
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(1);
                toast.success("Đã thêm vào giỏ hàng");
              }}
              className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#2828284D] backdrop-blur-[6px] flex items-center justify-center shadow"
            >
              <PlusAddCartIcon className="h-6 w-6 stroke-white" />
            </button>
          </div>
          <div className="p-2 text-2xs">
            <p>Merchant Name</p>
            <p>Product Name</p>
            <div className="flex items-center mt-1">
              <div className="flex">
                {[..."★★★★☆"].map((star, i) => (
                  <span key={i} className="text-[#1B1C1F]">
                    {star}
                  </span>
                ))}
              </div>
              <span className="ml-1">4.2 (12)</span>
            </div>
            <div className="text-sm font-medium mt-1">{formatPrice(props.product.price)}</div>
          </div>
        </div>
      )}
    </TransitionLink>
  );
}
