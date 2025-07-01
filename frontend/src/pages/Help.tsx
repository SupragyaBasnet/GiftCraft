import React, { useState } from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Link,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import InfoIcon from '@mui/icons-material/Info';

const Help: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqItems = [
    {
      id: 'panel1',
      question: 'How do I customize a product?',
      answer: 'Navigate to the product details page and click on the "Customize" button. You can then add text, images, change colors, and select sizes using the provided tools. A real-time preview will show your design.'
    },
    {
      id: 'panel2',
      question: 'What types of customization are available?',
      answer: 'We offer text addition, image uploads, color customization, and a variety of stickers/emojis. For some products, you can also select different views (front, back, side) and sizes.'
    },
    {
      id: 'panel3',
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 5-7 business days. Express shipping options are available for faster delivery, usually within 2-3 business days. You can track your order status from your account.'
    },
    {
      id: 'panel4',
      question: 'Can I return a customized product?',
      answer: 'Due to the personalized nature of our products, we generally do not accept returns unless there is a defect in the product or an error in customization made by GiftCraft. Please refer to our detailed return policy for more information.'
    },
    {
      id: 'panel5',
      question: 'How can I contact customer support?',
      answer: 'You can reach our customer support team via email at support@giftcraft.com or by phone at +977-9816315056 during business hours (9:00 AM - 5:00 PM, Sunday to Friday).'
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" fontWeight={700} sx={{ mb: 1, fontSize: { xs: '2rem', md: '2.4rem' } }}>
          Help & Support
        </Typography>
        <div className="heading-dash" style={{ marginTop: 0, marginBottom: 16 }} />

        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
            Frequently Asked Questions
          </Typography>
          {faqItems.map((item) => (
            <Accordion
              key={item.id}
              expanded={expanded === item.id}
              onChange={handleChange(item.id)}
              sx={{ mb: 1, borderRadius: 2, '&.Mui-expanded': { margin: '8px 0' } }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${item.id}-content`}
                id={`${item.id}-header`}
              >
                <Typography variant="subtitle1" fontWeight={600}>{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" color="text.secondary">{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <Box sx={{ textAlign: 'center', mt: 5 }}>

          <Typography variant="body1" sx={{ mb: 3 }}>
            If you have any other questions or need assistance, feel free to reach out to us.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/contact" underline="none">
              <Box component="span" sx={{ display: 'inline-block' }}>
                <Paper elevation={2} sx={{ px: 4, py: 1.5, bgcolor: 'primary.main', color: 'white', borderRadius: 2, fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', '&:hover': { bgcolor: 'primary.dark' } }}>
                  Contact Us
                </Paper>
              </Box>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Help; 