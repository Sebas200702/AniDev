import { HomeGeneratorService } from '@shared/services/home-generator-service'
import { getSessionUserInfo } from '@utils/get_session_user_info'
import type { APIRoute } from 'astro'

/**
 * POST /api/home/regenerate
 *
 * @description
 * Endpoint para regenerar las secciones del home.
 * Invalida el cache y genera nuevas secciones con IA.
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const userInfo = await getSessionUserInfo({
      request,
      accessToken: cookies.get('sb-access-token')?.value,
      refreshToken: cookies.get('sb-refresh-token')?.value,
    })

    const userId = userInfo?.id ?? null

    // Invalidar cache
    await HomeGeneratorService.invalidateCache(userId)

    // Generar nuevas secciones
    const sections = await HomeGeneratorService.buildHomeSections(userId)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Home sections regenerated successfully',
        sections,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error regenerating home sections:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
