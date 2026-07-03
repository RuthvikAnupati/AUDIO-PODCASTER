import React from 'react'
import { Link } from 'react-router-dom';

const Categories = () => {
    const cat = [
        {
            name: "Comedy",
            color: "bg-purple-200",
            to: "/categories/Comedy",
            img: "https://images.unsplash.com/photo-1543584756-8f40a802e14f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            name: "Business",
            color: "bg-green-200",
            to: "/categories/Business",
            img: "https://img.freepik.com/free-vector/businessmen-handshake-from-laptops-megaphone-collaboration-communication-corporate-cooperative-business-concept-white-background_335657-1775.jpg?t=st=1730374898~exp=1730378498~hmac=9405fa5f25b8f47b224dc84cf500573fded2b296ab4b1bda20c4ef3a6cd35875&w=996",
        },
        {
            name: "Education",
            color: "bg-red-200",
            to: "/categories/Education",
            img: "https://img.freepik.com/free-vector/education-concept-illustration_114360-7908.jpg?t=st=1730375427~exp=1730379027~hmac=d111dad6ecb74727b4a23e7892c1c44a52cda999c476c572a3b32237e41ed490&w=996",
        },
        {
            name: "Hobbies",
            color: "bg-zinc-200",
            to: "/categories/Hobbies",
            img: "https://img.freepik.com/free-vector/organic-flat-design-about-me-concept_23-2148905881.jpg?t=st=1730376901~exp=1730380501~hmac=7363ed628c9a82f46ab09b347ccdd8a1ad6e05dbaa01b4a6a41abcdd7f37b3cf&w=996",
        },
        {
            name: "Government",
            color: "bg-indigo-200",
            to: "/categories/Government",
            img: "https://img.freepik.com/free-vector/india-general-election-politics_24911-115659.jpg?t=st=1730376960~exp=1730380560~hmac=6f0581508d49d7454c29828cd9182facd352f49a1a96c5cd295bb14fd03430c5&w=900",
        },
    ];
    return (
        <div className='h-screen lg:h-[78vh]'>
            <div className='px-4 lg:px-12 py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {cat.map((items,i) => 
                <Link to={items.to} key={i} 
                className={` rounded px-8 py-4 text-xl font-semibold ${items.color} 
                hover:scale-105 shadow-xl transition-all duration-300 relative h-[22vh] overflow-hidden z-10`}
                >
                    <div>{items.name}</div>
                    <div className='w-[100%] flex items-center justify-end absolute -bottom-2 -right-2'>
                        <img src={items.img} alt="category" 
                        className='rounded rotate-12 h-[15vh] md:h-[17vh] lg:h-[18vh]' />
                    </div>
                </Link>)}
            </div>
        </div>
    )
}

export default Categories