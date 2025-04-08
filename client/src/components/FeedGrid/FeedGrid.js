import React, { useRef, useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import {
  GridContainer,
  GridItem
} from './FeedGrid.styles';
import Card from '../Card/Card'; // Import the Card component

// Placeholder feed items (replace with actual data fetching)
const initialItems = [
  // Mix of different aspect ratios
  { id: '1', type: 'ootd', title: 'OOTD 1', imageUrl: 'https://source.unsplash.com/random/400x600?fashion&sig=1', author: 'UserA', likes: 120 },
  { id: '2', type: 'hot', title: 'Hot Post 1', imageUrl: 'https://source.unsplash.com/random/400x400?style&sig=2', author: 'UserB', likes: 250 },
  { id: '3', type: 'event', title: 'Event 1', imageUrl: 'https://source.unsplash.com/random/400x300?sale&sig=3', description: 'Big Sale Happening!' },
  { id: '4', type: 'ootd', title: 'OOTD 2', imageUrl: 'https://source.unsplash.com/random/400x700?fashion&sig=4', author: 'UserC', likes: 95 },
  { id: '5', type: 'hot', title: 'Hot Post 2', imageUrl: 'https://source.unsplash.com/random/400x500?trend&sig=5', author: 'UserD', likes: 180 },
  { id: '6', type: 'ootd', title: 'OOTD 3', imageUrl: 'https://source.unsplash.com/random/400x650?fashion&sig=6', author: 'UserA', likes: 210 },
  { id: '7', type: 'hot', title: 'Hot Post 3', imageUrl: 'https://source.unsplash.com/random/400x450?style&sig=7', author: 'UserE', likes: 300 },
  { id: '8', type: 'event', title: 'Event 2', imageUrl: 'https://source.unsplash.com/random/400x350?promo&sig=8', description: 'Limited Time Offer!' },
  { id: '9', type: 'ootd', title: 'OOTD 4', imageUrl: 'https://source.unsplash.com/random/400x550?fashion&sig=9', author: 'UserF', likes: 150 },
  { id: '10', type: 'hot', title: 'Hot Post 4', imageUrl: 'https://source.unsplash.com/random/400x750?trend&sig=10', author: 'UserG', likes: 220 },
  { id: '11', type: 'ootd', title: 'OOTD 5', imageUrl: 'https://source.unsplash.com/random/400x600?fashion&sig=11', author: 'UserB', likes: 190 },
  { id: '12', type: 'hot', title: 'Hot Post 5', imageUrl: 'https://source.unsplash.com/random/400x500?style&sig=12', author: 'UserC', likes: 280 },
  { id: '13', type: 'event', title: 'Event 3', imageUrl: 'https://source.unsplash.com/random/400x400?discount&sig=13', description: 'Weekend Special!' },
  { id: '14', type: 'ootd', title: 'OOTD 6', imageUrl: 'https://source.unsplash.com/random/400x800?fashion&sig=14', author: 'UserD', likes: 110 },
  { id: '15', type: 'hot', title: 'Hot Post 6', imageUrl: 'https://source.unsplash.com/random/400x650?trend&sig=15', author: 'UserE', likes: 310 },
];

const FeedGrid = () => {
  const gridRef = useRef(null);
  const masonryRef = useRef(null);
  const [items, setItems] = useState(initialItems);
  const [isLoading, setIsLoading] = useState(false); // For infinite scroll later

  useEffect(() => {
    if (!gridRef.current || items.length === 0) return;

    // Initialize Masonry after images are loaded
    const imgLoad = imagesLoaded(gridRef.current);
    imgLoad.on('always', () => {
      if (masonryRef.current) {
        masonryRef.current.destroy(); // Destroy previous instance if exists
      }
      masonryRef.current = new Masonry(gridRef.current, {
        itemSelector: '.grid-item', // Use the class from GridItem style
        columnWidth: '.grid-item', // Use item width for column width calculation
        gutter: 16, // Adjust gutter size as needed (should match GridItem margin)
        percentPosition: true,
        // fitWidth: true // Consider if you want center alignment
      });
    });

    // Cleanup function to destroy Masonry instance on component unmount
    return () => {
      if (masonryRef.current) {
        masonryRef.current.destroy();
        masonryRef.current = null;
      }
    };
  }, [items]); // Re-run when items change

  // Placeholder for infinite scroll logic
  // useEffect(() => {
  //   const handleScroll = () => { ... };
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [isLoading]);

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}> {/* Use Box for padding */}
      <GridContainer ref={gridRef}>
        {items.map((item, index) => (
          <GridItem key={item.id || index} className="grid-item">
            <Card item={item} />
          </GridItem>
        ))}
      </GridContainer>
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default FeedGrid; 