def uniform_det_sampler(near, far, num_rays, num_samples):
    u = near + (far - near) * torch.arange(0, num_samples) / (num_samples - 1)
    return u.expand((num_rays, num_samples))

def uniform_rnd_sampler(near, far, num_rays, num_samples):
    return near + (far - near) * torch.rand((num_rays, num_samples))

def uniform_strat_sampler(near, far, num_rays, num_samples):
    u = uniform_det_sampler(near, far, num_rays, num_samples)
    return u + torch.rand(num_samples) * (u[1] - u[0])  