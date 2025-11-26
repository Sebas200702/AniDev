/**
 * Script de Prueba para MetadataService
 *
 * Este script puede ser usado para verificar que el MetadataService
 * funciona correctamente antes de implementarlo en producción.
 */

import { MetadataService } from '@shared/services/metadata-service'
import { createContextLogger } from '@libs/pino'

const logger = createContextLogger('MetadataServiceTest')

async function testMetadataService() {
  logger.info('🧪 Testing MetadataService...\n')

  // Test 1: Anime Metadata
  logger.info('1️⃣ Testing Anime Metadata (ID: 21 - One Piece)')
  try {
    const animeMetadata = await MetadataService.getAnimeMetadata(21)
    logger.info('✅ Success:', {
      title: animeMetadata.title.substring(0, 50) + '...',
      hasDescription: !!animeMetadata.description,
      hasImage: !!animeMetadata.image,
    })
  } catch (error) {
    console.error('❌ Error:', error)
  }

  logger.info('\n')

  // Test 2: Music Metadata
  logger.info('2️⃣ Testing Music Metadata (Theme ID: 123)')
  try {
    const musicMetadata = await MetadataService.getMusicMetadata(123)
    logger.info('✅ Success:', {
      title: musicMetadata.title,
      hasDescription: !!musicMetadata.description,
      hasImage: !!musicMetadata.image,
    })
  } catch (error) {
    console.error('❌ Error (expected if theme does not exist):', error)
  }

  logger.info('\n')

  // Test 3: Character Metadata
  logger.info('3️⃣ Testing Character Metadata (ID: 456)')
  try {
    const characterMetadata = await MetadataService.getCharacterMetadata(456)
    logger.info('✅ Success:', {
      title: characterMetadata.title,
      hasDescription: !!characterMetadata.description,
      hasImage: !!characterMetadata.image,
    })
  } catch (error) {
    console.error('❌ Error (expected if character does not exist):', error)
  }

  logger.info('\n')

  // Test 4: Artist Metadata
  logger.info('4️⃣ Testing Artist Metadata (Name: "LiSA")')
  try {
    const artistMetadata = await MetadataService.getArtistMetadata('LiSA')
    logger.info('✅ Success:', {
      title: artistMetadata.title,
      hasDescription: !!artistMetadata.description,
      hasImage: !!artistMetadata.image,
    })
  } catch (error) {
    console.error('❌ Error (expected if artist does not exist):', error)
  }

  logger.info('\n')

  // Test 5: Default Metadata (Fallback)
  logger.info('5️⃣ Testing Default Metadata (Fallback)')
  const defaultMetadata = MetadataService.getDefaultMetadata()
  logger.info('✅ Success:', {
    title: defaultMetadata.title,
    description: defaultMetadata.description.substring(0, 50) + '...',
    image: defaultMetadata.image,
  })

  logger.info('\n')

  // Test 6: Invalid ID (Should return default)
  logger.info('6️⃣ Testing Invalid ID (Should fallback to default)')
  try {
    const invalidMetadata = await MetadataService.getAnimeMetadata(999999999)
    logger.info('✅ Fallback Success:', {
      title: invalidMetadata.title,
      isDefault:
        invalidMetadata.title === MetadataService.getDefaultMetadata().title,
    })
  } catch (error) {
    console.error('❌ Error:', error)
  }

  logger.info('\n✨ Tests completed!')
}

// Ejecutar tests si este archivo es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testMetadataService().catch(console.error)
}

export { testMetadataService }
