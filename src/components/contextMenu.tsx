// import { useState } from 'react';

// export default function ContextMenu(
//     props: { children: React.ReactNode, 

//      }
// ) {
//     const [coords, setCoords] = useState({ x: 0, y: 0 });
//     const [showMenu, setShowMenu] = useState(false);

//     const handleContextMenu = (event: any) => {
//         // event.preventDefault();
//         // setCoords({ x: event.pageX, y: event.pageY });
//         // //récupérer l'élément sur lequel on a cliqué
//         // const element = document.elementFromPoint(event.clientX, event.clientY);
//         // //récupérer le parent le plus proche qui contient un attribut data-contextmenu-type
//         // if (!element) return;
//         // const parent = element.closest('[data-contextmenu-type]');
//         // console.log(element);


//         // setShowMenu(true);
//     };

//     const handleClick = () => {
//         setShowMenu(false);
//     };

//     return (
//         <div onContextMenu={handleContextMenu} onClick={handleClick} className='contextMenu'>
//             {showMenu && (
//                 <div style={{ position: 'absolute', top: coords.y, left: coords.x, backgroundColor: 'white', zIndex: 1000 }}>
//                     <p>Option 1</p>
//                     <p>Option 2</p>
//                     <p>Option 3</p>
//                 </div>
//             )}
//             {props.children}
//         </div>
//     );
// }