g++ -I headers -c src/helios.cpp -std=c++11 && ar rvs lib/libhelios.a helios.o && rm helios.o
