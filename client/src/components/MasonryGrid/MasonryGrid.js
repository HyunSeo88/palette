import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import { MasonryGridStyles } from '../MainLayout/MainLayout.styles'; // Assuming styles are still here or adjust path

const MasonryGrid = ({ children, columnWidthClass = '.masonry-item', gutter = 16 }) => {
  const gridRef = useRef(null);
  const masonryRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const initializeMasonry = () => {
      if (masonryRef.current) {
        masonryRef.current.destroy();
      }
      // Ensure items exist before initializing
      if (gridRef.current.children.length > 0) {
          masonryRef.current = new Masonry(gridRef.current, {
            itemSelector: '.masonry-item', // Class for items within this Masonry grid
            columnWidth: columnWidthClass, // Use prop for flexibility
            gutter: gutter,             // Use prop for flexibility
            percentPosition: true,
          });
          // Optional: Trigger layout again slightly after init, sometimes helps
          // setTimeout(() => masonryRef.current?.layout(), 100);
      }
    };

    // Initialize after images are loaded
    const imgLoad = imagesLoaded(gridRef.current);
    // Use .on( 'progress', ... ) if layout needs update as images load
    imgLoad.on('always', initializeMasonry);

    return () => {
      if (masonryRef.current) {
        masonryRef.current.destroy();
        masonryRef.current = null;
      }
      // imgLoad.off( 'always', initializeMasonry ); // Clean up listener if needed
    };
    // Rerun when children count changes, or potentially based on a prop indicating data refresh
  }, [children, columnWidthClass, gutter]);

  return (
    <MasonryGridStyles>
        <div ref={gridRef} className="my-masonry-grid"> {/* Apply container class */}
            {/* Wrap each child in a div with the itemSelector class */} 
            {React.Children.map(children, (child, index) => (
                <div key={index} className="masonry-item">{child}</div>
            ))}
        </div>
    </MasonryGridStyles>
  );
};

MasonryGrid.propTypes = {
    children: PropTypes.node,
    columnWidthClass: PropTypes.string,
    gutter: PropTypes.number,
};

export default MasonryGrid; 