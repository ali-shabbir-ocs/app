import './home.scss';
import { useState, useEffect, useRef, Fragment } from 'react';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [check, setCheck] = useState(true);
    const [searchChecks, setSearchChecks] = useState([]);
    const debounceTimer = useRef(null);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((value) => {
                setUsers(value);
                setFiltered(value);
            });
    }, []);

    const onSearchChange = (event) => {
        const searchFieldString = event.target.value.toLowerCase();
        setSearch(searchFieldString);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            const newFiltered = users.filter((user) =>
                user.name.toLowerCase().includes(searchFieldString)
            );
            setFiltered(newFiltered);

            if (searchFieldString && !searchChecks.some(item => item.name === searchFieldString)) {
                setSearchChecks(prev => [
                    ...prev,
                    { name: searchFieldString, checked: false }
                ]);
            }
        }, 2000);
    };

    const displayNone = () => {
        if (check) {
            setFiltered([]);
        } else {
            setFiltered(users);
        }
        setCheck(!check);
    };

    const handleCheckboxChange = (searchTerm) => {
        setSearchChecks(prevChecks =>
            prevChecks.map(check =>
                check.name === searchTerm
                    ? { ...check, checked: !check.checked }
                    : check
            )
        );
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='search-container'>
                    <input
                        className='search-box'
                        type='search'
                        placeholder='Type Here'
                        value={search}
                        onChange={onSearchChange}
                    />
                    {/* <button className='cancel-button' onClick={() => setSearch('')}>
                        Cancel
                    </button> */}
                </div>
                <div className='checkboxes'>
                    <input
                        type='checkbox'
                        checked={check}
                        name='all'
                        onClick={displayNone}
                    />
                    <label>All</label>
                    {
                        searchChecks.map((searchCheck) => (
                            <Fragment key={searchCheck.name}>
                                <input
                                    type='checkbox'
                                    checked={searchCheck.checked}
                                    name={searchCheck.name}
                                    onChange={() => handleCheckboxChange(searchCheck.name)}
                                />
                                <label>{searchCheck.name}</label>
                            </Fragment>
                        ))
                    }
                </div>
                <div className='table'>
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Mail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filtered.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Home;
