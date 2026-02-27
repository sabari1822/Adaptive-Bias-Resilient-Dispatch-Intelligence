def calculate_progress(predicted_time, time_elapsed):
    progress = (time_elapsed / predicted_time) * 100
    return min(round(progress), 95)

def compute_kci(prep_inflation, throughput_ratio, variance_spike):

    w1 = 0.4
    w2 = 0.4
    w3 = 0.2

    kci = (
        w1 * prep_inflation +
        w2 * (1 - throughput_ratio) +
        w3 * variance_spike
    )

    return min(max(kci, 0), 1)

def compute_mrs(drift_score, variance_instability, for_bias_score):

    w1 = 0.4
    w2 = 0.3
    w3 = 0.3

    bias_component = (
        w1 * drift_score +
        w2 * variance_instability +
        w3 * for_bias_score
    )

    mrs = 1 - min(max(bias_component, 0), 1)

    return mrs

def dynamic_dispatch_threshold(kci, mrs):

    threshold = 70 - (kci * 20) + ((1 - mrs) * 10)
    threshold = max(50, min(80, threshold))

    return threshold

def should_assign_rider(progress, predicted_time, time_elapsed,
                        rider_travel_time, kci, mrs):

    remaining_time = predicted_time - time_elapsed
    threshold = dynamic_dispatch_threshold(kci, mrs)

    if progress < threshold:
        return False, threshold

    rider_cost_per_minute = 102 / 60
    delay_penalty_per_min = 12   

    idle_now = max(remaining_time - rider_travel_time, 0)
    delay_now = max(rider_travel_time - remaining_time, 0)

    cost_now = (
        idle_now * rider_cost_per_minute +
        delay_now * delay_penalty_per_min
    )

    future_remaining = max(remaining_time - 1, 0)

    idle_future = max(future_remaining - rider_travel_time, 0)
    delay_future = max(rider_travel_time - future_remaining, 0)

    cost_future = (
        idle_future * rider_cost_per_minute +
        delay_future * delay_penalty_per_min
    )

    if cost_now <= cost_future:
        return True, threshold

    return False, threshold