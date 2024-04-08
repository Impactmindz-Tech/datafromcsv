"use client"
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface CSVData {
    Category: string;
    Emotion: string;
    Idea: string;
}

const Cards = () => {
    const [filedata, setFileData] = useState<CSVData[]>([]);
    const [displayedCards, setDisplayedCards] = useState<CSVData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isFlipped, setIsFlipped] = useState<boolean>(false); 
    const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('./data/short-ideas.csv');
                const text = await response.text();
                const parsedData = Papa.parse<CSVData>(text, { header: true });
                const data = parsedData.data;
                setFileData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let filteredData = filedata;
        if (searchTerm !== '') {
            filteredData = filedata.filter(item => item.Emotion.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        setDisplayedCards(filteredData.slice(0, 9));
        setIsFlipped(true); 
        setTimeout(() => {
            setIsFlipped(false); 
        }, 500);
    }, [filedata, searchTerm]);

    useEffect(() => {
        if (searchTerm === '') {
            const intervalId = setInterval(() => {
                const startIndex = Math.floor(Math.random() * (filedata.length - 9));
                const displayedSet = filedata.slice(startIndex, startIndex + 9);
                setDisplayedCards(displayedSet);
                setIsFlipped(true); 
                setTimeout(() => {
                    setIsFlipped(false); 
                }, 500);
            }, 5000);

            return () => clearInterval(intervalId);
        }
    }, [filedata, searchTerm]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    const toggleSearchVisibility = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <>
            <div className="search-icon bottom-10 right-10 absolute z-50" onClick={toggleSearchVisibility}>
                {isSearchVisible ? <FaTimes onClick={clearSearch} /> : <FaSearch />}
            </div>
            {isSearchVisible && (
                <div className="search-input">
                    <input
                        type="text"
                        placeholder="Search by Emotion"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search_bar"
                    />
                </div>
            )}
            <div className="card-container">
                {displayedCards.map((item, i) => (
                    
                    <>
                    <div className={"box card"} key={i}>
                        <div className={`content ${isFlipped ? 'flip' : ''}`}>
                            <div className="front">{item.Idea}</div>
                            <div className="back">{item.Emotion}</div>
                        </div>
                    </div>
                    </>
                ))}
            </div>
        </>
    );
};

export default Cards;