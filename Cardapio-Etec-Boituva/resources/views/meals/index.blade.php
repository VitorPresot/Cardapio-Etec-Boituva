<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Cardápio | ETEC Boituva</title>

    <!-- Bootstrap -->
    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
    >

    <!-- Bootstrap Icons -->
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
    >

    <style>
        :root {
            --primary: #176b3a;
            --primary-dark: #0e4d2a;
            --primary-light: #e9f7ef;
            --secondary: #f4b942;
            --background: #f5f7f6;
            --text: #202923;
            --muted: #718078;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            background: var(--background);
            color: var(--text);
            font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,
                "Segoe UI", sans-serif;
        }

        /* NAVBAR */

        .navbar-custom {
            background: linear-gradient(
                135deg,
                var(--primary-dark),
                var(--primary)
            );
            box-shadow: 0 4px 20px rgba(0, 0, 0, .12);
        }

        .brand {
            color: white !important;
            font-weight: 800;
            font-size: 1.25rem;
            letter-spacing: -.3px;
        }

        .brand-icon {
            width: 42px;
            height: 42px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,.15);
            border-radius: 12px;
            margin-right: 10px;
        }

        /* HERO */

        .hero {
            background:
                radial-gradient(
                    circle at top right,
                    rgba(255,255,255,.15),
                    transparent 35%
                ),
                linear-gradient(
                    135deg,
                    var(--primary-dark),
                    var(--primary)
                );
            color: white;
            padding: 70px 0 90px;
            margin-bottom: -40px;
        }

        .hero h1 {
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 800;
            letter-spacing: -1.5px;
        }

        .hero p {
            color: rgba(255,255,255,.82);
            font-size: 1.05rem;
            max-width: 650px;
        }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,255,255,.12);
            border: 1px solid rgba(255,255,255,.18);
            padding: 8px 14px;
            border-radius: 999px;
            font-size: .85rem;
            margin-bottom: 18px;
        }

        /* CONTENT */

        .content {
            position: relative;
            z-index: 2;
        }

        .week-card {
            background: white;
            border: none;
            border-radius: 22px;
            overflow: hidden;
            box-shadow: 0 8px 35px rgba(24, 52, 36, .08);
            margin-bottom: 35px;
        }

        .week-header {
            padding: 25px 28px;
            background: white;
            border-bottom: 1px solid #edf1ee;
        }

        .week-title {
            font-weight: 800;
            margin: 0;
        }

        .date-range {
            color: var(--muted);
            margin: 5px 0 0;
            font-size: .92rem;
        }

        .week-number {
            background: var(--primary-light);
            color: var(--primary);
            padding: 8px 14px;
            border-radius: 999px;
            font-weight: 700;
            font-size: .85rem;
        }

        /* MEAL CARDS */

        .meal-grid {
            padding: 25px;
        }

        .meal-card {
            height: 100%;
            border: 1px solid #e9eeeb;
            border-radius: 18px;
            padding: 22px;
            transition: all .2s ease;
            background: #fff;
        }

        .meal-card:hover {
            transform: translateY(-4px);
            border-color: #c9dfd1;
            box-shadow: 0 12px 28px rgba(23, 107, 58, .10);
        }

        .day-icon {
            width: 48px;
            height: 48px;
            background: var(--primary-light);
            color: var(--primary);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
        }

        .day-title {
            font-size: 1rem;
            font-weight: 800;
            margin: 0;
        }

        .day-date {
            color: var(--muted);
            font-size: .82rem;
        }

        .main-dish {
            background: #f8faf9;
            border-radius: 14px;
            padding: 16px;
            margin: 18px 0;
        }

        .main-dish-label {
            color: var(--primary);
            text-transform: uppercase;
            font-weight: 800;
            font-size: .68rem;
            letter-spacing: .7px;
            margin-bottom: 6px;
        }

        .main-dish p {
            margin: 0;
            line-height: 1.5;
            font-size: .94rem;
        }

        .food-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
            color: #49564e;
            font-size: .88rem;
        }

        .food-icon {
            width: 30px;
            height: 30px;
            border-radius: 9px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fff7df;
            color: #d69200;
        }

        .salad-icon {
            background: #e9f7ef;
            color: #198754;
        }

        /* NUTRITION */

        .nutrition {
            margin: 0 25px 25px;
            background: linear-gradient(
                135deg,
                #f0faf4,
                #f8fcf9
            );
            border: 1px solid #dceee2;
            border-radius: 18px;
            padding: 25px;
        }

        .nutrition-title {
            font-weight: 800;
            margin-bottom: 20px;
        }

        .nutrition-item {
            background: white;
            border-radius: 14px;
            padding: 17px;
            height: 100%;
            border: 1px solid #e5eee8;
        }

        .nutrition-icon {
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 11px;
            background: var(--primary-light);
            color: var(--primary);
            margin-bottom: 10px;
        }

        .nutrition-label {
            color: var(--muted);
            font-size: .75rem;
            font-weight: 600;
        }

        .nutrition-value {
            font-size: 1.25rem;
            font-weight: 800;
        }

        .nutrition-vet {
            color: var(--primary);
            font-size: .78rem;
            font-weight: 700;
        }

        /* FOOTER */

        footer {
            margin-top: 60px;
            padding: 35px 0;
            background: #14231a;
            color: rgba(255,255,255,.65);
        }

        footer strong {
            color: white;
        }

        /* MOBILE */

        @media (max-width: 768px) {
            .hero {
                padding: 50px 0 75px;
            }

            .week-header {
                padding: 20px;
            }

            .meal-grid {
                padding: 15px;
            }

            .nutrition {
                margin: 0 15px 15px;
            }

            .week-number {
                margin-top: 15px;
                display: inline-block;
            }
        }
    </style>
</head>

<body>

<!-- NAVBAR -->

<nav class="navbar navbar-custom">
    <div class="container py-2">

        <a href="/" class="navbar-brand brand d-flex align-items-center">
            <span class="brand-icon">
                <i class="bi bi-egg-fried"></i>
            </span>

            ETEC Boituva
        </a>

    </div>
</nav>


<!-- HERO -->

<section class="hero">

    <div class="container">

        <span class="hero-badge">
            <i class="bi bi-calendar3"></i>
            Cardápio escolar
        </span>

        <h1>
            Cardápio da<br>
            semana 🍽️
        </h1>

        <p class="mb-0">
            Confira as refeições, saladas, frutas e informações
            nutricionais disponíveis para os alunos.
        </p>

    </div>

</section>


<!-- CONTENT -->

<main class="container content">

    @forelse ($weeks as $week)

        <section class="week-card">

            <!-- WEEK HEADER -->

            <div class="week-header">

                <div class="row align-items-center">

                    <div class="col-md">

                        <h2 class="week-title">
                            Semana {{ $week->week_number }}
                        </h2>

                        <p class="date-range">
                            <i class="bi bi-calendar-week me-1"></i>

                            {{ $week->start_date->format('d/m/Y') }}

                            <span class="mx-1">até</span>

                            {{ $week->end_date->format('d/m/Y') }}
                        </p>

                    </div>

                    <div class="col-md-auto">

                        <span class="week-number">
                            <i class="bi bi-check-circle me-1"></i>
                            Cardápio disponível
                        </span>

                    </div>

                </div>

            </div>


            <!-- MEALS -->

            <div class="meal-grid">

                <div class="row g-3">

                    @foreach ($week->meals as $meal)

                        <div class="col-12 col-md-6 col-lg-4">

                            <article class="meal-card">

                                <div class="d-flex align-items-center gap-3">

                                    <div class="day-icon">
                                        <i class="bi bi-calendar-day"></i>
                                    </div>

                                    <div>

                                        <h3 class="day-title">
                                            {{ $meal->day_of_week }}
                                        </h3>

                                        <span class="day-date">
                                            {{ $meal->date->format('d/m/Y') }}
                                        </span>

                                    </div>

                                </div>


                                <!-- MAIN DISH -->

                                <div class="main-dish">

                                    <div class="main-dish-label">
                                        <i class="bi bi-egg-fried me-1"></i>
                                        Merenda
                                    </div>

                                    <p>
                                        {{ $meal->main_dish }}
                                    </p>

                                </div>


                                <!-- SALAD -->

                                @if ($meal->salad)

                                    <div class="food-item">

                                        <span class="food-icon salad-icon">
                                            <i class="bi bi-flower1"></i>
                                        </span>

                                        <div>
                                            <strong>Salada:</strong>
                                            {{ $meal->salad }}
                                        </div>

                                    </div>

                                @endif


                                <!-- FRUIT -->

                                @if ($meal->fruit)

                                    <div class="food-item">

                                        <span class="food-icon">
                                            <i class="bi bi-apple"></i>
                                        </span>

                                        <div>
                                            <strong>Fruta:</strong>
                                            {{ $meal->fruit }}
                                        </div>

                                    </div>

                                @endif

                            </article>

                        </div>

                    @endforeach

                </div>

            </div>


            <!-- NUTRITION -->

            @if ($week->nutritionInfo)

                <div class="nutrition">

                    <div class="d-flex align-items-center gap-2 mb-4">

                        <div class="nutrition-icon mb-0">
                            <i class="bi bi-bar-chart-fill"></i>
                        </div>

                        <div>
                            <h3 class="nutrition-title mb-0">
                                Composição nutricional
                            </h3>

                            <small class="text-muted">
                                Média semanal
                            </small>
                        </div>

                    </div>


                    <div class="row g-3">

                        <!-- ENERGY -->

                        <div class="col-6 col-lg-3">

                            <div class="nutrition-item">

                                <div class="nutrition-icon">
                                    <i class="bi bi-lightning-charge-fill"></i>
                                </div>

                                <div class="nutrition-label">
                                    ENERGIA
                                </div>

                                <div class="nutrition-value">
                                    {{ $week->nutritionInfo->energy_kcal }}
                                    <small>kcal</small>
                                </div>

                            </div>

                        </div>


                        <!-- CARBS -->

                        <div class="col-6 col-lg-3">

                            <div class="nutrition-item">

                                <div class="nutrition-icon">
                                    <i class="bi bi-basket2-fill"></i>
                                </div>

                                <div class="nutrition-label">
                                    CARBOIDRATOS
                                </div>

                                <div class="nutrition-value">
                                    {{ $week->nutritionInfo->carbohydrates_g }}
                                    <small>g</small>
                                </div>

                                <div class="nutrition-vet">
                                    {{ $week->nutritionInfo->carbohydrates_vet_percent }}%
                                    VET
                                </div>

                            </div>

                        </div>


                        <!-- PROTEINS -->

                        <div class="col-6 col-lg-3">

                            <div class="nutrition-item">

                                <div class="nutrition-icon">
                                    <i class="bi bi-activity"></i>
                                </div>

                                <div class="nutrition-label">
                                    PROTEÍNAS
                                </div>

                                <div class="nutrition-value">
                                    {{ $week->nutritionInfo->proteins_g }}
                                    <small>g</small>
                                </div>

                                <div class="nutrition-vet">
                                    {{ $week->nutritionInfo->proteins_vet_percent }}%
                                    VET
                                </div>

                            </div>

                        </div>


                        <!-- LIPIDS -->

                        <div class="col-6 col-lg-3">

                            <div class="nutrition-item">

                                <div class="nutrition-icon">
                                    <i class="bi bi-droplet-fill"></i>
                                </div>

                                <div class="nutrition-label">
                                    LIPÍDIOS
                                </div>

                                <div class="nutrition-value">
                                    {{ $week->nutritionInfo->lipids_g }}
                                    <small>g</small>
                                </div>

                                <div class="nutrition-vet">
                                    {{ $week->nutritionInfo->lipids_vet_percent }}%
                                    VET
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            @endif

        </section>

    @empty

        <div class="week-card text-center p-5">

            <div class="display-4 mb-3">
                🍽️
            </div>

            <h2>
                Nenhum cardápio disponível
            </h2>

            <p class="text-muted mb-0">
                Ainda não há refeições cadastradas.
            </p>

        </div>

    @endforelse

</main>


<!-- FOOTER -->

<footer>

    <div class="container text-center">

        <strong>ETEC Boituva</strong>

        <div class="small mt-2">
            Cardápio escolar
        </div>

    </div>

</footer>


<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js">
</script>

</body>
</html>