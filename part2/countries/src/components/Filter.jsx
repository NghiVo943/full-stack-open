const Filter = ({ filter, filterHandler }) => {
    return (
        <div>find countries <input value={filter} onChange={filterHandler} /></div>
    )
}

export default Filter