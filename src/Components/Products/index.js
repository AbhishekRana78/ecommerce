import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Image, List, message, Rate, Select } from "antd";
import { addToCart, getAllProducts, getProductsByCategory } from "../../API";
import { useParams } from "react-router-dom";

function Products() {
  const [loading, setLoading] = useState(false);
  const param = useParams();
  const [items, setItems] = useState([]);
  const [sortOrder, setSortOrder] = useState("az");

  useEffect(() => {
    setLoading(true);
    (param?.categoryId
      ? getProductsByCategory(param.categoryId)
      : getAllProducts()
    ).then((res) => {
      setItems(res.products);
      setLoading(false);
    });
  }, [param]);

  const getSortedItems = () => {
    const sortedItems = [...items];
    sortedItems.sort((a, b) => {
      const aLowerCaseTitle = a.title.toLowerCase();
      const bLowerCaseTitle = b.title.toLowerCase();

      if (sortOrder === "az") {
        return aLowerCaseTitle > bLowerCaseTitle
          ? 1
          : aLowerCaseTitle === bLowerCaseTitle
          ? 0
          : -1;
      } else if (sortOrder === "za") {
        return aLowerCaseTitle < bLowerCaseTitle
          ? 1
          : aLowerCaseTitle === bLowerCaseTitle
          ? 0
          : -1;
      } else if (sortOrder === "lowHigh") {
        return a.price > b.price ? 1 : a.price === b.price ? 0 : -1;
      } else if (sortOrder === "highLow") {
        return a.price < b.price ? 1 : a.price === b.price ? 0 : -1;
      }
      return 0; // Default return statement
    });
    return sortedItems;
  };

  const addToCartHandler = (item) => {
    message.success(`${item.title} has been added to cart!`);
    addToCart(item.id);
  };

  return (
    <div className="productsContainer">
      <div>
        <span>View Items Sorted By: </span>
        <Select
          onChange={(value) => {
            setSortOrder(value);
          }}
          defaultValue={"az"}
          options={[
            {
              label: "Alphabetically a-z",
              value: "az",
            },
            {
              label: "Alphabetically z-a",
              value: "za",
            },
            {
              label: "Price Low to High",
              value: "lowHigh",
            },
            {
              label: "Price High to Low",
              value: "highLow",
            },
          ]}
        ></Select>
      </div>
      <List
        loading={loading}
        grid={{ column: 3 }}
        dataSource={getSortedItems()}
        renderItem={(product) => (
          <Badge.Ribbon
            className="itemCardBadge"
            text={`${product.discountPercentage}% Off`}
            color="pink"
          >
            <Card
              className="itemCard"
              title={product.title}
              cover={<Image className="itemCardImage" src={product.thumbnail} />}
              actions={[
                <Rate allowHalf disabled value={product.rating} />,
                <Button
                  type="link"
                  onClick={() => addToCartHandler(product)}
                >
                  Add to Cart
                </Button>,
              ]}
            >
              <Card.Meta
                title={
                  <>
                    Price: ${product.price}{" "}
                    <span style={{ textDecoration: "line-through" }}>
                      ${parseFloat(
                        product.price +
                          (product.price * product.discountPercentage) / 100
                      ).toFixed(2)}
                    </span>
                  </>
                }
                description={
                  <p
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {product.description}
                  </p>
                }
              />
            </Card>
          </Badge.Ribbon>
        )}
      ></List>
    </div>
  );
}

export default Products;
