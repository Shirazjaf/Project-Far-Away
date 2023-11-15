import { useState } from "react";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
  { id: 3, description: "Charger", quantity: 1, packed: true },
];

const App = () => {
  const [items, setItems] = useState(initialItems);

  function handleAddItem(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItem(id) {
    console.log(id);
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleCheckbox(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleClear() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all items?"
    );
    if (confirmed) setItems([]);
  }

  return (
    <>
      <Logo />
      <Form onAddItems={handleAddItem} />
      <PackingList
        items={items}
        onDeleteItems={handleDeleteItem}
        onCheckbox={handleCheckbox}
        onClearclick={handleClear}
      />
      <Stats items={items} />
    </>
  );
};

export default App;

function Logo() {
  return <h1> Far away </h1>;
}

function Form({ onAddItems }) {
  const [description, setDescription] = useState("");
  const [selectbox, setSelectbox] = useState(1);

  function handleFunction(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = { description, selectbox, packed: false, id: Date.now() };
    console.log(newItem);

    onAddItems(newItem);

    setDescription("");
    setSelectbox("");
  }

  return (
    <form className="add-form" onSubmit={handleFunction}>
      <h3>What do you need for your trip?</h3>
      <select
        value={selectbox}
        onChange={(e) => setSelectbox(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="item.."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function PackingList({ items, onDeleteItems, onCheckbox, onClearclick }) {
  const [sortBy, setSortBy] = useState("input");

  let sorted;

  if (sortBy === "input") sorted = items;

  if (sortBy === "description")
    sorted = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "packed")
    sorted = items.slice().sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {" "}
        {sorted.map((item) => (
          <Item
            item={item}
            onDeleteItems={onDeleteItems}
            onCheckbox={onCheckbox}
            key={item.id}
          />
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={onClearclick}>Clear list</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItems, onCheckbox }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onCheckbox(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItems(item.id)}>&times;</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding some items to your packing list</em>
      </p>
    );
  const numItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;
  const percentPacked = Math.round((packedItems / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentPacked === 100
          ? "You ve got everything ready to go "
          : `You have ${numItems} items on your list, and you already packed
        ${packedItems} (${percentPacked})`}
      </em>
    </footer>
  );
}
