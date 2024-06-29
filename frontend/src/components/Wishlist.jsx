import React, { useContext, useState, useEffect, useRef } from "react";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import UpdateWishlistModal from "./UpdateWishlistModal";
import CanBuyModal from "./CanBuyModal";
import { useDrop, useDrag } from "react-dnd";

const Wishlist = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [isUpdateWishlistPressed, setIsUpdateWishlistPressed] = useState(false);
  const [canBuy, setCanBuy] = useState(false);
  const [isCanBuyButtonPressed, setIsCanBuyButtonPressed] = useState(false);
  const ref = useRef(null);

  // type of element that can be draggable
  const type = "Wishlist";

  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: () => {
      return {
        index: props.index,
        id: props.wishlist.wishlist_id,
        wishlist_item: props.wishlist.wishlist_item,
        wishlist_cost: props.wishlist.wishlist_cost,
      };
    },
    canDrag: () => props.wishlist.wishlist_status === "UNPURCHASED",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ handlerId }, drop] = useDrop({
    accept: type,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current || props.wishlist.wishlist_status === "PURCHASED") {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = props.index;

      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      props.moveWishlist(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;

      // persist the index as wishlist_position in database

      updateWishlistForUser(
        props.wishlist.wishlist_id,
        parseInt(dragIndex),
        props.wishlist
      );
      updateWishlistForUser(item.id, parseInt(hoverIndex), item);
    },
  });

  const updateWishlistForUser = async (
    wishlist_id,
    wishlist_position,
    wishlist
  ) => {
    try {
      const body = {
        wishlist_item: wishlist.wishlist_item,
        wishlist_cost: parseFloat(wishlist.wishlist_cost),
        wishlist_position: wishlist_position,
      };

      const res = await fetchData(
        `/api/wishlists/${wishlist_id}`,
        "PATCH",
        body,
        userCtx.accessToken
      );

      if (res.ok) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteWishlistForUser = async (wishlist_id) => {
    try {
      const res = await fetchData(
        `/api/wishlists/${wishlist_id}`,
        "DELETE",
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        props.getWishlistCost();
        props.getAllWishlistForAUser();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkIfCanBuy = () => {
    const excessBudget = userCtx.budget - userCtx.expense;
    if (userCtx.budget !== undefined && userCtx.expense !== undefined) {
      if (
        props.wishlist &&
        props.wishlist.wishlist_status === "UNPURCHASED" &&
        excessBudget >= props.wishlist.wishlist_cost
      ) {
        setCanBuy(true);
      } else {
        setCanBuy(false);
      }
    }
  };

  useEffect(() => {
    if (
      userCtx.accessToken &&
      userCtx.budget !== undefined &&
      userCtx.expense !== undefined
    ) {
      checkIfCanBuy();
    }
  }, [
    userCtx.accessToken,
    userCtx.budget,
    userCtx.expense,
    props.wishlist ? props.wishlist.wishlist_status : null,
    props.wishlist ? props.wishlist.wishlist_cost : null,
  ]);

  drag(drop(ref));

  return (
    <div
      style={{
        backgroundColor:
          props.wishlist && props.wishlist.wishlist_status === "PURCHASED"
            ? "#cbdee7"
            : "",
        opacity: isDragging ? 0 : 1,
        cursor:
          props.wishlist && props.wishlist.wishlist_status === "UNPURCHASED"
            ? "move"
            : "",
      }}
      className="pt-1 pb-3"
      ref={ref}
      data-handler-id={handlerId}
    >
      {isUpdateWishlistPressed && (
        <UpdateWishlistModal
          wishlist={props.wishlist}
          setIsUpdateWishlistPressed={setIsUpdateWishlistPressed}
          getAllWishlistForAUser={props.getAllWishlistForAUser}
          getWishlistCost={props.getWishlistCost}
          checkIfCanBuy={checkIfCanBuy}
        ></UpdateWishlistModal>
      )}
      {isCanBuyButtonPressed && (
        <CanBuyModal
          setIsCanBuyButtonPressed={setIsCanBuyButtonPressed}
          setCanBuy={setCanBuy}
          getAllWishlistForAUser={props.getAllWishlistForAUser}
          wishlist={props.wishlist}
          getWishlistCost={props.getWishlistCost}
        ></CanBuyModal>
      )}
      {props.wishlist && (
        <div className="grid grid-cols-6 gap-3">
          <div>{props.wishlist.wishlist_item}</div>
          <div>
            {" "}
            {new Intl.NumberFormat("en-SG", {
              style: "currency",
              currency: "SGD",
            }).format(props.wishlist.wishlist_cost)}
          </div>
          {props.wishlist.wishlist_store.slice(0, 5) === "https" ? (
            <a
              className="col-span-2 line-clamp-3"
              href={props.wishlist.wishlist_store}
              target="_blank"
            >
              {props.wishlist.wishlist_store}
            </a>
          ) : (
            <div className="col-span-2">{props.wishlist.wishlist_store}</div>
          )}
          <div>
            {props.wishlist.wishlist_status === "PURCHASED" ? (
              <div className="flex space-x-2">
                {" "}
                <i className="bi bi-emoji-sunglasses"></i>
                <span>purchased</span>
              </div>
            ) : (
              <div className="flex space-x-2">
                <i className="bi bi-emoji-frown"></i>
                <span>unpurchased</span>
              </div>
            )}
          </div>
          <div className="flex justify-evenly">
            {canBuy ? (
              <button
                onClick={() => setIsCanBuyButtonPressed(true)}
                title="can buy"
              >
                <i className="bi bi-bell-fill"></i>
              </button>
            ) : (
              <div className="w-4"></div>
            )}
            <button
              onClick={() => setIsUpdateWishlistPressed(true)}
              title="update"
            >
              <i className="bi bi-pencil-fill"></i>
            </button>
            <button
              onClick={() => deleteWishlistForUser(props.wishlist.wishlist_id)}
              title="delete"
            >
              <i className="bi bi-trash3-fill"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
