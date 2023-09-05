import "./App.css";
import "./style/index.css";
import axios from "axios";
import {
  Button,
  Divider,
  Input,
  Modal,
  Table,
  message,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocalStorageState } from "ahooks";

function App() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [basketData, setBasketData] = useLocalStorageState("Basket", {
    defaultValue: [],
  });
  console.log(basketData);

  const success = (title) => {
    messageApi.open({
      type: "success",
      content: "Added to cart",
    });
    setBasketData((prev) => [title, ...prev]);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
      filteredValue: [search],
      onFilter: (search, record) => {
        return record.title.toLowerCase().includes(search.toLowerCase());
      },
    },
    {
      title: "Deeds",
      dataIndex: "",
      key: "",
      render: (title, row) => {
        return <Button onClick={() => success(row)}>Add to Card</Button>;
      },
    },
  ];

  useEffect(() => {
    axios
      .get("https://dummyjson.com/products")
      .then((res) => setData(res.data.products))
      .catch((err) => console.log(err));
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const BasketDelete = (id) => {
    setBasketData((prev) => {
      return prev.filter((event) => {
        return event.id !== id;
      });
    });
  };

  return (
    <>
      {contextHolder}
      <div className={"flex items-center justify-center py-10"}>
        <div className={"py-30"}>
          <div className={"flex items-center gap-3"}>
            <Input
              placeholder="Search"
              allowClear
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
              }}
            />
            <Button
              onClick={showModal}
              type={"primary"}
              className={"bg-[blue]"}
            >
              Basket
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              pageSize: 20,
            }}
          />
        </div>
      </div>
      <Modal
        title="Products"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
      >
        <Divider />
        <div>
          {basketData.map((item, index) => {
            return (
              <div
                className={"flex items-center justify-between my-5 border-b-2"}
              >
                <Typography key={index} className={"font-bold"}>
                  {item.title}
                </Typography>
                <Button onClick={() => BasketDelete(item.id)}>Delete</Button>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
}

export default App;
