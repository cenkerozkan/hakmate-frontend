import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FAQ() {
  const [expanded, setExpanded] = React.useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(
      isExpanded ? [...expanded, panel] : expanded.filter((item) => item !== panel),
    );
  };

  return (
    <Container
      id="faq"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        sx={{
          color: 'text.primary',
          width: { xs: '100%', sm: '100%', md: '60%' },
          textAlign: 'center',
        }}
      >
        Sıkça Sorulan Sorular
      </Typography>

      <Box sx={{ width: '100%' }}>
        {[
          {
            key: 'panel1',
            question: 'Destek ekibinize nasıl ulaşabilirim?',
            answer: (
              <>
                Destek ekibimize&nbsp;
                <Link href="mailto:destek@hakmate.com">destek@hakmate.com</Link>
                &nbsp;adresinden e-posta atabilir veya 0850 xxx xx xx numaralı hattımızı
                arayabilirsiniz. Size en kısa sürede yardımcı olmaktan memnuniyet duyarız.
              </>
            ),
          },
          {
            key: 'panel3',
            question: 'Hakmate’i benzerlerinden ayıran nedir?',
            answer:
              'Hakmate, hukuk alanına özel geliştirilen yapay zekâ algoritmaları, güçlü içtihat veritabanı ve kullanıcı dostu arayüzüyle öne çıkar. Sürekli güncellenen içeriğiyle ihtiyaçlarınıza dinamik şekilde uyum sağlar.',
          },
          {
            key: 'panel4',
            question: 'Doğru cevap garantisi sunuyor musunuz?',
            answer:
              'Cevaplarımız hukuk uzmanları tarafından denetlenir ve en yüksek doğrulukta bilgi sunmayı hedefler. Ancak, verilen cevapların kesinliği konusunda garanti veremeyiz. Hukuki bir işlem öncesinde bir uzmana danışmanızı öneririz.',
          },
        ].map(({ key, question, answer }) => (
          <Accordion
            key={key}
            expanded={expanded.includes(key)}
            onChange={handleChange(key)}
            sx={{
              mb: 1,
              '& .MuiAccordionSummary-root': {
                flexWrap: 'wrap',
                minHeight: { xs: 56, sm: 'auto' },
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${key}d-content`}
              id={`${key}d-header`}
            >
              <Typography component="span" variant="subtitle2">
                {question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                gutterBottom
                sx={{
                  maxWidth: { xs: '100%', md: '70%' },
                  textAlign: 'left',
                }}
              >
                {answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}
